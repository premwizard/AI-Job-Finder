from typing import Any, Dict, List

from src.storage.state_manager import load_weekly_stats


def get_current_analytics() -> Dict[str, Any]:
    # In a real app, this would query a DB for today's stats.
    # We will return mock/static structure for now or read the latest weekly stat
    stats = load_weekly_stats()
    if stats:
        latest = stats[-1]
        return {
            "raw_jobs": latest.get("raw_jobs", 0),
            "duplicates": 0,
            "new_jobs": latest.get("new_jobs", 0),
            "rejection_reasons": {"Score too low": 5, "Penalty": 2},
            "source_health": latest.get("source_health", {}),
        }
    return {
        "raw_jobs": 0,
        "duplicates": 0,
        "new_jobs": 0,
        "rejection_reasons": {},
        "source_health": {},
    }


def get_weekly_summary() -> List[Dict[str, Any]]:
    return load_weekly_stats()
