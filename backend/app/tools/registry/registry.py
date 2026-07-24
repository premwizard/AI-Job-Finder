from typing import List, Optional
from app.tools.base_tool import BaseTool

class ToolRegistry:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ToolRegistry, cls).__new__(cls)
            cls._instance.tools = {}
        return cls._instance

    def register(self, tool: BaseTool):
        self.tools[tool.name] = tool

    def get_tool(self, name: str) -> Optional[BaseTool]:
        return self.tools.get(name)

    def get_all_tools(self) -> List[BaseTool]:
        return list(self.tools.values())
        
    def get_tools_by_category(self, category: str) -> List[BaseTool]:
        return [t for t in self.tools.values() if t.category == category]
