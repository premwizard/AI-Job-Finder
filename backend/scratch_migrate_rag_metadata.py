import logging
from app.database.database import engine, Base
from app.models.models import RAGDocumentMetadata

logging.basicConfig(level=logging.INFO)

def migrate():
    # Only create tables that don't exist
    RAGDocumentMetadata.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created rag_document_metadata table.")

if __name__ == "__main__":
    migrate()
