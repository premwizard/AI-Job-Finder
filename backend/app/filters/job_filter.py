from typing import Dict, Any

from app.config.config import (
    ACCEPT_EXPERIENCE,
    ACCEPT_LOCATIONS,
    ACCEPT_ROLES,
    REJECT_DOMAINS,
    REJECT_EXPERIENCE,
    REJECT_LOCATIONS,
    SCORE_THRESHOLD,
)


def score_job(job: Dict[str, Any]) -> Dict[str, Any]:
    """
    Score a job based on the V3 scoring engine rules.
    Returns: {"score": int, "accepted": bool, "reason": str, "category": str}
    """
    title = (job.get("role") or job.get("title") or "").lower()
    location = (job.get("location") or "").lower()
    description = (job.get("description") or "").lower()
    combined_text = title + " " + description

    score = 0
    category = "Other"

    # 1. Role / Domain Check
    for reject in REJECT_DOMAINS:
        if reject.lower() in title:
            return {
                "score": -100,
                "accepted": False,
                "reason": f"Penalty: Rejected Domain ({reject})",
                "category": category,
            }

    role_matched = False
    for accept in ACCEPT_ROLES:
        if accept.lower() in title:
            score += 50
            category = accept
            role_matched = True
            break

    if not role_matched:
        return {
            "score": 0,
            "accepted": False,
            "reason": "No accepted role matched",
            "category": category,
        }

    # 2. Experience Check
    for reject in REJECT_EXPERIENCE:
        if reject.lower() in combined_text:
            return {
                "score": -100,
                "accepted": False,
                "reason": f"Penalty: Rejected Experience ({reject})",
                "category": category,
            }

    exp_matched = False
    for accept in ACCEPT_EXPERIENCE:
        if accept.lower() in combined_text:
            score += 50
            exp_matched = True
            break

    # 3. Location Check
    for reject in REJECT_LOCATIONS:
        if reject.lower() in location:
            return {
                "score": -100,
                "accepted": False,
                "reason": f"Penalty: Rejected Location ({reject})",
                "category": category,
            }

    loc_matched = False
    if "remote" in location or "worldwide" in location or "anywhere" in location:
        score += 20
        loc_matched = True
    else:
        for accept in ACCEPT_LOCATIONS:
            if accept.lower() in location:
                score += 20
                loc_matched = True
                break

    if not loc_matched:
        return {
            "score": score,
            "accepted": False,
            "reason": "Location not in accepted list",
            "category": category,
        }

    # Final Decision
    accepted = score >= SCORE_THRESHOLD
    reason = (
        f"Score {score} >= {SCORE_THRESHOLD}"
        if accepted
        else f"Score {score} < {SCORE_THRESHOLD}"
    )

    if exp_matched:
        reason += " (Fresher keyword matched)"
    else:
        reason += " (No explicit fresher keyword)"

    return {
        "score": score,
        "accepted": accepted,
        "reason": reason,
        "category": category,
    }
