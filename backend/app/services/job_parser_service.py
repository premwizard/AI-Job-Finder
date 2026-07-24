import json
import logging
from sqlalchemy.orm import Session
from app.models.models import Job
from app.ai.parser.ai_provider import GeminiProvider
from app.ai.prompts.job_parser_prompt import JOB_PARSER_PROMPT
from app.schemas.ai_parsing_schemas import JobParsingResponse
from typing import Dict, Any

logger = logging.getLogger(__name__)

class JobParserService:
    def __init__(self, db: Session):
        self.db = db
        # We can inject this or use a factory in the future
        self.ai_provider = GeminiProvider()

    def parse_job(self, job_id: int) -> Dict[str, Any]:
        job = self.db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job with id {job_id} not found.")

        # If it has no description, we can't parse it
        if not job.description_clean and not job.description_raw:
            job.parsing_status = "failed"
            job.ai_processed = True
            self.db.commit()
            raise ValueError(f"Job {job_id} has no description to parse.")

        text_to_parse = job.description_clean or job.description_raw

        try:
            raw_response = self.ai_provider.parse_text(JOB_PARSER_PROMPT, text_to_parse)
            
            # Clean possible markdown formatting
            if raw_response.startswith("```json"):
                raw_response = raw_response.replace("```json\n", "")
                if raw_response.endswith("```"):
                    raw_response = raw_response[:-3]
            elif raw_response.startswith("```"):
                raw_response = raw_response.replace("```\n", "")
                if raw_response.endswith("```"):
                    raw_response = raw_response[:-3]

            parsed_json = json.loads(raw_response)
            
            # Validate with Pydantic
            validated_data = JobParsingResponse(**parsed_json)
            
            job.parsed_data_json = validated_data.model_dump_json()
            job.ai_summary = validated_data.ai_summary
            job.confidence_scores_json = validated_data.confidence.model_dump_json()
            job.processing_version += 1
            job.ai_model_used = "gemini-1.5-flash"
            job.prompt_version = "v1"
            job.ai_processed = True
            job.parsing_status = "success"
            
            self.db.commit()
            self.db.refresh(job)
            
            return validated_data.model_dump()
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI JSON response for job {job_id}: {e}")
            job.parsing_status = "failed_json"
            self.db.commit()
            raise ValueError(f"AI returned invalid JSON: {e}")
        except Exception as e:
            logger.error(f"Error parsing job {job_id}: {e}")
            job.parsing_status = "failed"
            self.db.commit()
            raise e

    def parse_all_unprocessed(self):
        unprocessed_jobs = self.db.query(Job).filter(Job.ai_processed == False).limit(50).all()
        results = {"success": 0, "failed": 0}
        
        for job in unprocessed_jobs:
            try:
                self.parse_job(job.id)
                results["success"] += 1
            except Exception:
                results["failed"] += 1
                
        return results

    def get_parsing_statistics(self) -> Dict[str, Any]:
        total = self.db.query(Job).count()
        processed = self.db.query(Job).filter(Job.ai_processed == True, Job.parsing_status == "success").count()
        pending = self.db.query(Job).filter(Job.ai_processed == False).count()
        failed = self.db.query(Job).filter(Job.parsing_status.like("failed%")).count()
        
        return {
            "total_jobs": total,
            "processed_jobs": processed,
            "pending_jobs": pending,
            "failed_jobs": failed
        }
