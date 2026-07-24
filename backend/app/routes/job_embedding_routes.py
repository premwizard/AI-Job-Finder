from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.job_embedding_service import JobEmbeddingService

router = APIRouter(prefix="/api/jobs", tags=["job_embeddings"])

@router.get("/embeddings/statistics")
def get_embedding_statistics(db: Session = Depends(get_db)):
    service = JobEmbeddingService(db)
    return service.get_statistics()

@router.get("/{job_id}/embeddings")
def get_job_embeddings(job_id: int, db: Session = Depends(get_db)):
    from app.models.models import Job, JobChunkMetadata
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    chunks = db.query(JobChunkMetadata).filter(JobChunkMetadata.job_id == job_id).all()
    return {
        "job_id": job_id,
        "embedding_status": job.embedding_status,
        "chunks": [{"chunk_id": c.chunk_id, "type": c.chunk_type} for c in chunks]
    }

@router.post("/{job_id}/embeddings")
def generate_job_embedding(job_id: int, db: Session = Depends(get_db)):
    service = JobEmbeddingService(db)
    try:
        result = service.embed_job(job_id)
        return {"message": "Job successfully embedded", "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error during embedding")

@router.delete("/{job_id}/embeddings")
def delete_job_embedding(job_id: int, db: Session = Depends(get_db)):
    service = JobEmbeddingService(db)
    # Delete from chroma
    service.vector_store.delete_by_job_id(job_id)
    # Delete from SQL
    from app.models.models import Job, JobChunkMetadata
    db.query(JobChunkMetadata).filter(JobChunkMetadata.job_id == job_id).delete()
    job = db.query(Job).filter(Job.id == job_id).first()
    if job:
        job.embedding_status = False
    db.commit()
    return {"message": "Embeddings deleted"}

@router.post("/embeddings/generate-all")
def generate_all_embeddings_background(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    def process_queue():
        from app.database.database import SessionLocal
        bg_db = SessionLocal()
        try:
            bg_service = JobEmbeddingService(bg_db)
            bg_service.embed_all_pending()
        finally:
            bg_db.close()
            
    background_tasks.add_task(process_queue)
    return {"message": "Bulk embedding started in the background"}
