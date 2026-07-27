"""
Standardized Time-To-Live (TTL) policies for the caching layer.
Values are in seconds.
"""

class TTLPolicy:
    # Short: Fast-moving data (1-5 minutes)
    SHORT = 60 * 5
    
    # Session / Authentication / Rate Limits (15-60 minutes)
    SESSION = 60 * 30
    
    # Medium: Profiles, Resume Metadata, AI Job Recommendations (1-6 hours)
    MEDIUM = 60 * 60 * 2
    
    # Long: Company Data, Static Embeddings, External API configurations (24-48 hours)
    LONG = 60 * 60 * 24

    # Analytics: Expensive daily calculations (12 hours)
    ANALYTICS = 60 * 60 * 12
