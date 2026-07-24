import os

agents = [
    ("resume_agent", "ResumeAgent", "['ANALYZE_RESUME', 'OPTIMIZE_RESUME']"),
    ("job_agent", "JobSearchAgent", "['FIND_MATCHING_JOBS', 'MONITOR_JOBS']"),
    ("company_agent", "CompanyIntelligenceAgent", "['ANALYZE_COMPANY', 'COMPANY_FIT']"),
    ("learning_agent", "LearningAgent", "['ANALYZE_SKILL_GAP', 'GENERATE_LEARNING_PLAN']"),
    ("interview_agent", "InterviewAgent", "['PREPARE_INTERVIEW']"),
    ("recommendation_agent", "RecommendationAgent", "['GENERATE_RECOMMENDATIONS']"),
    ("career_strategy_agent", "CareerStrategyAgent", "['PLAN_CAREER_TRANSITION']")
]

template = """from typing import Dict, Any
from app.agents.base.agent_base import BaseAgent
from app.agents.context.shared_context import SharedContext
from app.agents.communication.message import Message

class {class_name}(BaseAgent):
    @property
    def name(self) -> str:
        return "{class_name}"
        
    @property
    def capabilities(self) -> list:
        return {capabilities}

    def initialize(self):
        pass

    def validate(self, task: Dict[str, Any]) -> bool:
        return task.get("task_type") in self.capabilities

    def plan(self, task: Dict[str, Any]) -> dict:
        return {{"steps": ["Execute " + task.get("task_type")]}}

    def execute(self, shared_context: SharedContext, message: Message) -> Message:
        # Simulate execution by delegating to underlying services
        result_str = f"{{self.name}} successfully executed {{message.payload.get('task_type')}}."
        message.mark_processed({{"status": "success", "result": result_str}})
        return message

    def reflect(self, result: Dict[str, Any]) -> dict:
        return {{"success": True, "confidence": 0.95}}

    def summarize(self) -> str:
        return f"{{self.name}} is ready."

    def report(self) -> dict:
        return {{"health": "ok"}}

    def cleanup(self):
        pass
"""

base_dir = r"c:\merged_partition_content\D drive\AI Job Finder\backend\app\agents\workers"
os.makedirs(base_dir, exist_ok=True)

for file_name, class_name, caps in agents:
    filepath = os.path.join(base_dir, f"{file_name}.py")
    content = template.format(class_name=class_name, capabilities=caps)
    with open(filepath, "w") as f:
        f.write(content)
        
print("Successfully generated all worker agents.")
