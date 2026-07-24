from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.tools.registry.registry import ToolRegistry
from app.tools.executor.executor import ToolExecutor
from app.routes.auth_routes import get_current_user
from app.models.models import User, ToolExecutionLog
from app.tools.providers.internal.calculator_tool import CalculatorTool
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter(prefix="/api/tools", tags=["tools"])

class ExecuteRequest(BaseModel):
    tool_name: str
    parameters: Dict[str, Any]

# Register default tools
registry = ToolRegistry()
registry.register(CalculatorTool())

@router.get("")
def list_tools(current_user: User = Depends(get_current_user)):
    tools = registry.get_all_tools()
    return [{
        "name": t.name,
        "description": t.description,
        "category": t.category,
        "input_schema": t.input_schema.schema()
    } for t in tools]

@router.post("/execute")
def execute_tool(req: ExecuteRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    executor = ToolExecutor(db)
    result = executor.execute_tool(req.tool_name, current_user.id, req.parameters)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result)
    return result

@router.get("/statistics")
def get_statistics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_execs = db.query(ToolExecutionLog).count()
    failed_execs = db.query(ToolExecutionLog).filter(ToolExecutionLog.success == False).count()
    avg_latency = db.query(func.avg(ToolExecutionLog.latency_ms)).scalar() or 0.0
    
    return {
        "registered_tools": len(registry.get_all_tools()),
        "total_executions": total_execs,
        "failures": failed_execs,
        "success_rate": ((total_execs - failed_execs) / total_execs * 100) if total_execs > 0 else 100.0,
        "average_latency_ms": round(avg_latency, 2)
    }
