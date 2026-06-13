import json
import os
from src.config import STATE_FILE

def load_seen_jobs() -> set:
    """Load the set of seen job URLs or IDs from the state file."""
    if not os.path.exists(STATE_FILE):
        return set()
    try:
        with open(STATE_FILE, "r") as f:
            data = json.load(f)
            return set(data)
    except Exception as e:
        print(f"Error loading seen jobs: {e}")
        return set()

def save_seen_jobs(seen_jobs: set):
    """Save the set of seen job URLs or IDs to the state file."""
    try:
        with open(STATE_FILE, "w") as f:
            json.dump(list(seen_jobs), f, indent=4)
    except Exception as e:
        print(f"Error saving seen jobs: {e}")
