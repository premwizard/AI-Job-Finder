from app.modules.queue.core.celery_app import celery_app
import time
import logging

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=3)
def sample_heavy_ai_analysis(self, document_text: str):
    """
    A sample long-running job demonstrating backoff retries and tracking.
    """
    logger.info(f"Starting sample AI analysis job {self.request.id}")
    
    try:
        # Simulate heavy processing (e.g. OCR, Embeddings, LLM calls)
        time.sleep(10)
        
        word_count = len(document_text.split())
        
        # Simulate an external API failure randomly
        if "fail" in document_text.lower() and self.request.retries == 0:
            raise ValueError("Simulated temporary API failure")
            
        logger.info(f"Successfully processed document. Word count: {word_count}")
        return {"status": "success", "word_count": word_count, "analysis": "Document looks great."}
        
    except Exception as exc:
        logger.warning(f"Job failed, retrying... Attempt {self.request.retries + 1}")
        # Exponential backoff retry: 5s, 25s, 125s...
        raise self.retry(exc=exc, countdown=5 ** (self.request.retries + 1))
