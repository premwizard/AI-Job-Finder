"""
Migration script for RAGDocumentMetadata table.

Ensures the rag_document_metadata table exists in SQLite database.
"""

import logging
from app.database.database import engine
from app.models.models import RAGDocumentMetadata

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create rag_document_metadata table if it does not already exist."""
    RAGDocumentMetadata.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created rag_document_metadata table.")


if __name__ == "__main__":
    migrate()
