import time
from typing import Dict, Any
from pydantic import ValidationError
from sqlalchemy.orm import Session
from app.tools.registry.registry import ToolRegistry
from app.models.models import ToolExecutionLog

class ToolExecutor:
    def __init__(self, db: Session):
        self.db = db
        self.registry = ToolRegistry()

    def execute_tool(self, tool_name: str, user_id: str, params: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.time()
        tool = self.registry.get_tool(tool_name)
        
        if not tool:
            self._log_execution(tool_name, user_id, False, 0, "Tool not found")
            return {"error": "Tool not found"}

        try:
            # Validate input using Pydantic schema
            validated_params = tool.input_schema(**params).dict()
            
            # Execute
            result = tool.execute(validated_params)
            
            latency = (time.time() - start_time) * 1000
            self._log_execution(tool.name, user_id, True, latency, None)
            
            return {"status": "success", "result": result, "latency_ms": latency}
            
        except ValidationError as e:
            latency = (time.time() - start_time) * 1000
            error_msg = f"Validation Error: {e.errors()}"
            self._log_execution(tool.name, user_id, False, latency, error_msg)
            return {"error": "Invalid parameters", "details": e.errors()}
            
        except Exception as e:
            latency = (time.time() - start_time) * 1000
            error_msg = str(e)
            self._log_execution(tool.name, user_id, False, latency, error_msg)
            return {"error": "Execution failed", "details": error_msg}

    def _log_execution(self, tool_name: str, user_id: str, success: bool, latency: float, error: str):
        log = ToolExecutionLog(
            tool_name=tool_name,
            user_id=user_id,
            success=success,
            latency_ms=latency,
            error_message=error
        )
        self.db.add(log)
        self.db.commit()
