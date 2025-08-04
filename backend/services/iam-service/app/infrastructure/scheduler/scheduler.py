from loguru import logger
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta, date
from app.infrastructure.repositories.member_repository import MemberRepository
from app.infrastructure.repositories.trainer_repository import TrainerRepository

class SchedulerService:
    def __init__(self, member_repository: MemberRepository, trainer_repository: TrainerRepository):
        self.scheduler = BackgroundScheduler()
        self.member_repository = member_repository
        self.trainer_repository = trainer_repository

    def start(self):
        logger.info("⏰ Starting background job scheduler...")
        # self.scheduler.add_job(self.flag_and_archive_expired_measurements, 'interval', hours=24)
        # self.scheduler.add_job(self.update_member_ages, 'interval', hours=24)
        self.scheduler.add_job(self.update_trainer_ages, 'interval', hours=24)
        self.scheduler.add_job(self.update_trainer_experience, 'interval', hours=24)

        self.scheduler.start()

    # def flag_and_archive_expired_measurements(self):
    #     one_month_ago = datetime.now() - timedelta(days=30)
    #     self.member_repository.process_outdated_measurements(one_month_ago)


    # def update_member_ages(self):
    #   logger.info("🔄 Running age update job...")

    #   profiles = self.member_repository.get_all_profiles()

    #   today = date.today()

    #   for profile in profiles:
    #       if not profile.birthdate:
    #           continue

    #       new_age = today.year - profile.birthdate.year - (
    #           (today.month, today.day) < (profile.birthdate.month, profile.birthdate.day)
    #       )

    #       if profile.age != new_age:
    #           logger.info(f"🔧 Updating age for member {profile.member_id} from {profile.age} → {new_age}")
    #           self.member_repository.update_profile_by_member_id(
    #               member_id=profile.member_id,
    #               update_fields={"age": new_age}
    #           )

    #   logger.info("✅ Age update job complete.")
        

    def update_trainer_ages(self):
      logger.info("🔄 Running age update job...")

      trainers = self.trainer_repository.get_all_trainers()

      today = date.today()

      for trainer in trainers:
          if not trainer.birth_date:
              continue

          new_age = today.year - trainer.birth_date.year - (
              (today.month, today.day) < (trainer.birth_date.month, trainer.birth_date.day)
          )

          if trainer.age != new_age:
              logger.info(f"🔧 Updating age for trainer {trainer.id} from {trainer.age} → {new_age}")
              self.trainer_repository.update_trainer_by_id(
                  trainer_id=trainer.id,
                  update_fields={"age": new_age}
              )

      logger.info("✅ Age update job complete.")    


    def update_trainer_experience(self):
        logger.info("🔄 Running age update job...")

        trainers = self.trainer_repository.get_all_trainers()

        today = date.today()

        for trainer in trainers:
            if not trainer.years_of_experience:
                continue

            new_years_of_experience = today.year - trainer.years_of_experience.year - (
                (today.month, today.day) < (trainer.years_of_experience.month, trainer.years_of_experience.day)
            )

            if trainer.years_of_experience != new_years_of_experience:
                logger.info(f"🔧 Updating years_of_experience for trainer {trainer.id} from {trainer.years_of_experience} → {new_years_of_experience}")
                self.trainer_repository.update_trainer_by_id(
                    trainer_id=trainer.id,
                    update_fields={"years_of_experience": new_years_of_experience}
                )

        logger.info("✅ years_of_experience update job complete.")     