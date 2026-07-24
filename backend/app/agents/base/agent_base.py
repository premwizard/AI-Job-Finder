from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAgent(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass
        
    @property
    @abstractmethod
    def capabilities(self) -> list:
        pass

    @abstractmethod
    def initialize(self):
        pass

    @abstractmethod
    def validate(self, task: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    def plan(self, task: Dict[str, Any]) -> dict:
        pass

    @abstractmethod
    def execute(self, shared_context: 'SharedContext', message: 'Message') -> 'Message':
        pass

    @abstractmethod
    def reflect(self, result: Dict[str, Any]) -> dict:
        pass

    @abstractmethod
    def summarize(self) -> str:
        pass

    @abstractmethod
    def report(self) -> dict:
        pass

    @abstractmethod
    def cleanup(self):
        pass
