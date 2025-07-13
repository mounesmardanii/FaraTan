from loguru import logger
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from app.infrastructure.repositories.member_repository import MemberRepository
class SchedulerService:
    def __init__(self, member_repository: MemberRepository):
        self.scheduler = BackgroundScheduler()
        self.measurement_repository = member_repository

    def start(self):
        logger.info("⏰ Starting background job scheduler...")
        self.scheduler.add_job(self.flag_and_archive_expired_measurements, 'interval', hours=24)
        self.scheduler.start()

    def flag_and_archive_expired_measurements(self):
        one_month_ago = datetime.now() - timedelta(days=30)
        self.measurement_repository.process_outdated_measurements(one_month_ago)