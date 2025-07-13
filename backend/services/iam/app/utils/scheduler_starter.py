from app.core.postgres_db.database import get_db
from app.infrastructure.repositories.member_repository import MemberRepository
from app.infrastructure.scheduler.scheduler import SchedulerService

def starter():
    db = next(get_db()) 
    member_repo = MemberRepository(db)
    scheduler = SchedulerService(member_repo)
    scheduler.start()