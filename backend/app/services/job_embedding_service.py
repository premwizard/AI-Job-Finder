import logging
import json
from sqlalchemy.orm import Session
from app.models.models import Job, JobChunkMetadata
from app.ai.embeddings.chunker import ChunkGenerator
from app.ai.embeddings.providers import GeminiEmbeddingProvider
from app.ai.embeddings.vector_store import ChromaVectorStore

logger = logging.getLogger(__name__)

class JobEmbeddingService:
    def __init__(self, db: Session):
        self.db = db
        self.provider = GeminiEmbeddingProvider()
        self.vector_store = ChromaVectorStore()
        
    def embed_job(self, job_id: int):
        job = self.db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found.")
            
        if not job.ai_processed or not job.parsed_data_json:
            raise ValueError(f"Job {job_id} must be AI processed before embedding.")
            
        # 1. Generate semantic chunks
        chunks = ChunkGenerator.generate_chunks(job_id, job.parsed_data_json)
        if not chunks:
            raise ValueError(f"Failed to generate chunks for job {job_id}.")
            
        # 2. Extract texts to embed
        texts_to_embed = [chunk["text"] for chunk in chunks]
        
        # 3. Generate Embeddings (batch request)
        try:
            embeddings = self.provider.generate_embeddings(texts_to_embed)
        except Exception as e:
            logger.error(f"Provider failed to generate embeddings for job {job_id}: {e}")
            raise e
            
        # 4. Prepare vectors and metadata for ChromaDB
        ids = [chunk["chunk_id"] for chunk in chunks]
        
        # Extract rich metadata for filtering
        parsed_data = json.loads(job.parsed_data_json)
        base_metadata = {
            "job_id": job.id,
            "company_name": job.company_name or "Unknown",
            "job_title": job.job_title or "Unknown",
            "employment_type": parsed_data.get("employment_type", ""),
            "work_mode": parsed_data.get("work_mode", ""),
            "industry": parsed_data.get("company_industry", ""),
            "source": job.source or "unknown",
        }
        
        # Add chunk specific metadata
        metadatas = []
        for chunk in chunks:
            meta = base_metadata.copy()
            meta["chunk_type"] = chunk["chunk_type"]
            meta["chunk_order"] = chunk["chunk_order"]
            metadatas.append(meta)
            
        # 5. Insert into Vector Store
        # Delete old vectors first if regenerating
        self.vector_store.delete_by_job_id(job_id)
        self.vector_store.insert(ids, embeddings, texts_to_embed, metadatas)
        
        # 6. Save Chunk metadata to SQL Database
        # Clear existing chunk metadata
        self.db.query(JobChunkMetadata).filter(JobChunkMetadata.job_id == job_id).delete()
        
        for i, chunk in enumerate(chunks):
            chunk_record = JobChunkMetadata(
                job_id=job_id,
                chunk_id=chunk["chunk_id"],
                chunk_type=chunk["chunk_type"],
                chunk_order=chunk["chunk_order"],
                embedding_version="v1"
            )
            self.db.add(chunk_record)
            
        job.embedding_status = True
        self.db.commit()
        return {"chunks_embedded": len(chunks)}
        
    def embed_all_pending(self):
        # Fetch jobs that are parsed but not embedded
        pending_jobs = self.db.query(Job).filter(Job.ai_processed == True, Job.embedding_status == False).limit(50).all()
        results = {"success": 0, "failed": 0}
        
        for job in pending_jobs:
            try:
                self.embed_job(job.id)
                results["success"] += 1
            except Exception as e:
                logger.error(f"Failed embedding job {job.id}: {e}")
                results["failed"] += 1
                
        return results

    def get_statistics(self):
        total_jobs = self.db.query(Job).count()
        embedded_jobs = self.db.query(Job).filter(Job.embedding_status == True).count()
        pending_jobs = self.db.query(Job).filter(Job.ai_processed == True, Job.embedding_status == False).count()
        total_chunks = self.db.query(JobChunkMetadata).count()
        
        avg_chunks = (total_chunks / embedded_jobs) if embedded_jobs > 0 else 0
        
        return {
            "total_jobs": total_jobs,
            "embedded_jobs": embedded_jobs,
            "pending_jobs": pending_jobs,
            "total_chunks": total_chunks,
            "avg_chunks_per_job": round(avg_chunks, 1),
            "provider": "gemini-text-embedding-004",
            "vector_store": "ChromaDB"
        }
