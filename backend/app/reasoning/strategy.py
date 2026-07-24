class ExecutionStrategy:
    @staticmethod
    def get_next_executable_tasks(tasks, strategy: str = "sequential"):
        """
        Determines which tasks can be executed next based on the strategy and dependencies.
        For simplicity, 'sequential' returns the highest priority pending task.
        'parallel' could return all pending tasks whose dependencies are met.
        """
        if strategy == "sequential":
            # Return first pending task ordered by priority
            for t in sorted(tasks, key=lambda x: x.priority):
                if t.status == "pending":
                    return [t]
            return []
        
        elif strategy == "parallel":
            # In a full implementation, check task.dependencies vs completed tasks.
            # Here we just return all pending for simplicity.
            return [t for t in tasks if t.status == "pending"]
            
        return []
