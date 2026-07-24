from app.database.database import engine, Base
from app.models.models import Job, JobLocation, JobSkill, JobRequirement, JobBenefit, SavedJob, Application

# Drop all related tables to be safe, then recreate them
def migrate():
    # Drop dependents first
    SavedJob.__table__.drop(engine, checkfirst=True)
    Application.__table__.drop(engine, checkfirst=True)
    JobLocation.__table__.drop(engine, checkfirst=True)
    JobSkill.__table__.drop(engine, checkfirst=True)
    JobRequirement.__table__.drop(engine, checkfirst=True)
    JobBenefit.__table__.drop(engine, checkfirst=True)
    
    # Drop jobs
    Job.__table__.drop(engine, checkfirst=True)
    
    # Recreate all
    Base.metadata.create_all(engine)
    print("Migration completed: Jobs and related tables dropped and recreated.")

if __name__ == "__main__":
    migrate()
