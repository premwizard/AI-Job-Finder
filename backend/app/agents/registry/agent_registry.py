from typing import Dict, List, Optional
from app.agents.base.agent_base import BaseAgent
import time

class AgentRegistry:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AgentRegistry, cls).__new__(cls)
            cls._instance.agents = {}
            cls._instance.stats = {}
        return cls._instance

    def register(self, agent: BaseAgent):
        self.agents[agent.name] = agent
        self.stats[agent.name] = {
            "status": "active",
            "tasks_completed": 0,
            "tasks_failed": 0,
            "avg_execution_time": 0.0,
            "last_active": time.time()
        }

    def get_agent(self, name: str) -> Optional[BaseAgent]:
        return self.agents.get(name)

    def get_all_agents(self) -> List[BaseAgent]:
        return list(self.agents.values())

    def update_stats(self, agent_name: str, success: bool, execution_time: float):
        if agent_name in self.stats:
            stats = self.stats[agent_name]
            if success:
                stats["tasks_completed"] += 1
            else:
                stats["tasks_failed"] += 1
                
            total_tasks = stats["tasks_completed"] + stats["tasks_failed"]
            # Running average
            stats["avg_execution_time"] = ((stats["avg_execution_time"] * (total_tasks - 1)) + execution_time) / total_tasks
            stats["last_active"] = time.time()

    def get_stats(self) -> Dict:
        return self.stats
