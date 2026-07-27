import os
from celery import Celery

# Read Redis URL from environment or fallback to localhost
redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

# Initialize Celery app
celery_app = Celery(
    "ai_job_finder_queue",
    broker=redis_url,
    backend=redis_url,
    include=[
        "app.modules.queue.jobs.sample_ai_job"
        # Add future workers here:
        # "app.modules.queue.jobs.resume_worker",
        # "app.modules.queue.jobs.ai_worker",
    ]
)

# Optional configuration, see the application user guide.
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],  # Ignore other content
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    worker_prefetch_multiplier=1, # Fair distribution
    task_acks_late=True, # Ensure job is only acknowledged when completed successfully
    broker_connection_retry_on_startup=True
)

# Define priority queues if needed (Optional for now)
# celery_app.conf.task_routes = {
#     'app.modules.queue.jobs.critical.*': {'queue': 'critical'},
#     'app.modules.queue.jobs.background.*': {'queue': 'background'},
# }
