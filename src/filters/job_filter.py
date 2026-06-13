import re
from typing import Dict, Optional
from src.config import ROLES, LOCATIONS, EXPERIENCE_LEVELS, EXCLUDE_KEYWORDS

def matches_role(title: str) -> Optional[str]:
    """Check if the title matches any of our target roles. Returns the matched role category."""
    title_lower = title.lower()
    for role in ROLES:
        if role.lower() in title_lower:
            return role
        # Try word boundaries for stricter matching if needed, but simplistic is fine for now
        keywords = role.lower().split()
        if all(kw in title_lower for kw in keywords if len(kw) > 2):
            return role
    return None

def matches_location(job_location: str) -> bool:
    """Check if location matches our criteria."""
    loc_lower = job_location.lower()
    if "remote" in loc_lower or "anywhere" in loc_lower or "worldwide" in loc_lower:
        return True
    for loc in LOCATIONS:
        if loc.lower() in loc_lower:
            return True
    return False

def matches_fresher(title: str, description: str = "") -> bool:
    """Check if job is suitable for a fresher and doesn't contain exclude keywords."""
    combined_text = (title + " " + description).lower()
    
    # 1. Reject high experience
    for exclude in EXCLUDE_KEYWORDS:
        if exclude.lower() in combined_text:
            return False
            
    # 2. Require fresher keywords
    for exp in EXPERIENCE_LEVELS:
        if exp.lower() in combined_text:
            return True
            
    return False

def filter_job(job: Dict) -> Optional[Dict]:
    """
    Apply all filters to a job dictionary. 
    Returns the job with an added 'category' field if it passes, else Returns None.
    """
    title = job.get('role', '')
    location = job.get('location', '')
    description = job.get('description', '')
    
    # 1. Role match
    matched_role = matches_role(title)
    if not matched_role:
        return None
        
    # 2. Location match
    if not matches_location(location):
        return None
        
    # 3. Fresher match
    if not matches_fresher(title, description):
        return None
        
    job['category'] = matched_role
    return job
