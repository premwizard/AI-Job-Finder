from celery import Task
from typing import Any, Dict, Optional
import time

class JobDispatcher:
    """
    Abstracts Celery job dispatching to easily switch out implementations 
    and provide consistent logging/monitoring.
    """
    
    @staticmethod
    def dispatch_immediate(task: Task, *args, **kwargs) -> Any:
        """Dispatch a job to be executed immediately"""
        return task.delay(*args, **kwargs)

    @staticmethod
    def dispatch_delayed(task: Task, countdown_seconds: int, *args, **kwargs) -> Any:
        """Dispatch a job to be executed after a delay"""
        return task.apply_async(args=args, kwargs=kwargs, countdown=countdown_seconds)
    
    @staticmethod
    def dispatch_priority(task: Task, priority: int, *args, **kwargs) -> Any:
        """Dispatch a job with priority (requires Redis Priority Queue support configured in Celery)"""
        # Lower number is higher priority in Redis/Celery usually (0-9)
        return task.apply_async(args=args, kwargs=kwargs, priority=priority)

    @staticmethod
    def get_job_status(task_id: str, celery_app) -> Dict[str, Any]:
        """Fetch status of a dispatched job"""
        result = celery_app.AsyncResult(task_id)
        return {
            "task_id": task_id,
            "status": result.status,
            "result": result.result if result.ready() else None,
            "traceback": result.traceback if result.failed() else None
        }
