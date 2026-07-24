import json
from typing import List, Dict, Any

class ChunkGenerator:
    @staticmethod
    def generate_chunks(job_id: int, parsed_data_json: str) -> List[Dict[str, Any]]:
        """
        Takes the structured JSON output from the AI Job Parser and converts it into 
        semantic text chunks ready for embedding.
        """
        try:
            data = json.loads(parsed_data_json)
        except json.JSONDecodeError:
            return []

        chunks = []
        
        # 1. Job Overview Chunk
        overview_text = []
        if data.get("job_title"): overview_text.append(f"Title: {data.get('job_title')}")
        if data.get("department"): overview_text.append(f"Department: {data.get('department')}")
        if data.get("company_industry"): overview_text.append(f"Industry: {data.get('company_industry')}")
        if data.get("employment_type"): overview_text.append(f"Type: {data.get('employment_type')}")
        if data.get("work_mode"): overview_text.append(f"Work Mode: {data.get('work_mode')}")
        if data.get("ai_summary"): overview_text.append(f"Summary: {data.get('ai_summary')}")
        
        if overview_text:
            chunks.append({
                "chunk_id": f"job_{job_id}_overview",
                "chunk_type": "Overview",
                "text": "\n".join(overview_text)
            })

        # 2. Responsibilities Chunk
        responsibilities = data.get("responsibilities", [])
        if responsibilities:
            chunks.append({
                "chunk_id": f"job_{job_id}_responsibilities",
                "chunk_type": "Responsibilities",
                "text": "Responsibilities:\n- " + "\n- ".join(responsibilities)
            })

        # 3. Requirements Chunk
        reqs = data.get("requirements", {})
        req_text = []
        if reqs.get("required"):
            req_text.append("Required:\n- " + "\n- ".join(reqs["required"]))
        if reqs.get("preferred"):
            req_text.append("Preferred:\n- " + "\n- ".join(reqs["preferred"]))
        
        if req_text:
            chunks.append({
                "chunk_id": f"job_{job_id}_requirements",
                "chunk_type": "Requirements",
                "text": "\n\n".join(req_text)
            })

        # 4. Technical Skills Chunk
        tech_skills = data.get("technical_skills", {})
        skill_text = []
        for category, skills in tech_skills.items():
            if skills:
                cat_name = category.replace("_", " ").title()
                skill_text.append(f"{cat_name}: " + ", ".join(skills))
        
        if skill_text:
            chunks.append({
                "chunk_id": f"job_{job_id}_tech_skills",
                "chunk_type": "Technical Skills",
                "text": "Technical Skills:\n" + "\n".join(skill_text)
            })
            
        # 5. Soft Skills Chunk
        soft_skills = data.get("soft_skills", [])
        if soft_skills:
            chunks.append({
                "chunk_id": f"job_{job_id}_soft_skills",
                "chunk_type": "Soft Skills",
                "text": "Soft Skills: " + ", ".join(soft_skills)
            })
            
        # 6. Benefits Chunk
        benefits = data.get("benefits", [])
        if benefits:
            chunks.append({
                "chunk_id": f"job_{job_id}_benefits",
                "chunk_type": "Benefits",
                "text": "Benefits:\n- " + "\n- ".join(benefits)
            })

        # Add chunk_order automatically
        for i, chunk in enumerate(chunks):
            chunk["chunk_order"] = i
            chunk["job_id"] = job_id
            
        return chunks
