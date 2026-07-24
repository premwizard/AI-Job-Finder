from typing import Dict, Any
from app.agents.base.agent_base import BaseAgent
from app.agents.context.shared_context import SharedContext
from app.agents.communication.message import Message

class InterviewAgent(BaseAgent):
    @property
    def name(self) -> str:
        return "InterviewAgent"
        
    @property
    def capabilities(self) -> list:
        return ['PREPARE_INTERVIEW']

    def initialize(self):
        pass

    def validate(self, task: Dict[str, Any]) -> bool:
        return task.get("task_type") in self.capabilities

    def plan(self, task: Dict[str, Any]) -> dict:
        return {"steps": ["Execute " + task.get("task_type")]}

    def execute(self, shared_context: SharedContext, message: Message) -> Message:
        # Simulate execution by delegating to underlying services
        result_str = f"{self.name} successfully executed {message.payload.get('task_type')}."
        message.mark_processed({"status": "success", "result": result_str})
        return message

    def reflect(self, result: Dict[str, Any]) -> dict:
        return {"success": True, "confidence": 0.95}

    def summarize(self) -> str:
        return f"{self.name} is ready."

    def report(self) -> dict:
        return {"health": "ok"}

    def cleanup(self):
        pass
