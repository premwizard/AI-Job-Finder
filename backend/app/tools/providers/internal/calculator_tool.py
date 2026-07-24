from typing import Dict, Any
from pydantic import BaseModel, Field
from app.tools.base_tool import BaseTool

class CalculatorInput(BaseModel):
    operation: str = Field(..., description="add, subtract, multiply, divide")
    a: float = Field(..., description="First number")
    b: float = Field(..., description="Second number")

class CalculatorTool(BaseTool):
    @property
    def name(self) -> str:
        return "CalculatorTool"
        
    @property
    def description(self) -> str:
        return "Performs basic mathematical operations."
        
    @property
    def category(self) -> str:
        return "internal"

    @property
    def input_schema(self):
        return CalculatorInput

    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        op = params.get("operation")
        a = params.get("a")
        b = params.get("b")
        
        if op == "add":
            return {"result": a + b}
        elif op == "subtract":
            return {"result": a - b}
        elif op == "multiply":
            return {"result": a * b}
        elif op == "divide":
            if b == 0:
                raise ValueError("Cannot divide by zero")
            return {"result": a / b}
        else:
            raise ValueError(f"Unknown operation: {op}")
