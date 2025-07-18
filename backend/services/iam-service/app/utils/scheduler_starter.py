from app.core.postgres_db.database import get_db
from app.infrastructure.repositories.member_repository import MemberRepository
from app.infrastructure.scheduler.scheduler import SchedulerService
from app.infrastructure.repositories.trainer_repository import TrainerRepository

def starter():
    db = next(get_db()) 
    member_repo = MemberRepository(db)
    trainer_repo = TrainerRepository(db)
    scheduler = SchedulerService(member_repo, trainer_repo)
    scheduler.start()