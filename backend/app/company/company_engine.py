import json
import os
import google.generativeai as genai
from typing import Dict, Any, List

class CompanyEngine:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def aggregate_company_intelligence(self, company_name: str, job_descriptions: List[str]) -> Dict[str, Any]:
        if not job_descriptions:
            return {
                "tech_stack": [],
                "benefits": [],
                "culture": {"mission": "", "engineering_culture": ""},
                "ai_summary": "Insufficient data to generate a summary."
            }
            
        # We only pass a sample if there are too many jobs to avoid token overflow
        sample_jobs = job_descriptions[:10]
        context = "\n---\n".join(sample_jobs)
        
        prompt = f"""
        You are a highly skilled AI Career Agent analyzing the company "{company_name}".
        Based on the following aggregated job descriptions posted by this company, deduce the company's internal intelligence.
        
        JOB DESCRIPTIONS:
        {context}
        
        Extract and return a JSON object with this exact structure:
        {{
            "tech_stack": ["React", "Python", "Docker", "AWS", "..."],
            "benefits": ["Remote Work", "Health Insurance", "..."],
            "culture": {{
                "mission": "Derived mission or vision statement based on the postings.",
                "engineering_culture": "Description of how they work (e.g. Agile, fast-paced, testing focus)."
            }},
            "ai_summary": "A 2-3 paragraph professional summary of what it's like to work at this company, their core focus, and their technology stack."
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
                
            parsed = json.loads(text.strip())
            return parsed
        except Exception as e:
            print(f"Company Engine Error: {e}")
            return {
                "tech_stack": [],
                "benefits": [],
                "culture": {"mission": "", "engineering_culture": ""},
                "ai_summary": "Error analyzing company data."
            }
