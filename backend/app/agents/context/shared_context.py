from typing import Dict, Any, List

class SharedContext:
    def __init__(self, user_id: str, goal_id: int):
        self.user_id = user_id
        self.goal_id = goal_id
        
        # State tracking
        self.execution_plan: List[Dict] = []
        self.completed_tasks: List[Dict] = []
        
        # Cross-agent memory
        self.retrieved_knowledge: Dict[str, Any] = {}
        self.user_profile: Dict[str, Any] = {}
        self.temporary_memory: Dict[str, Any] = {}

    def update_knowledge(self, key: str, value: Any):
        self.retrieved_knowledge[key] = value

    def add_completed_task(self, task_info: Dict):
        self.completed_tasks.append(task_info)
