from typing import List, Optional, Annotated
from uuid import UUID
from fastapi import Depends, HTTPException
from app.infrastructure.repositories.schedule_repository import GymScheduleRepository
from app.domain.models.schedule_model import GymSchedule
from app.domain.schemas.schedule_schema import GymScheduleCreateSchema


class GymScheduleService:
    def __init__(self, repo: Annotated[GymScheduleRepository, Depends()]):
        self.repo = repo

    def create(self, data: GymScheduleCreateSchema) -> GymSchedule:
        schedule = GymSchedule(
          session_id=data.session_id , 
          sport_id=data.sport_id , 
          weekday=data.weekday , 
          start_time=data.start_time , 
          end_time=data.end_time 
        )
        return self.repo.create(schedule)

    def get_by_id(self, schedule_id: UUID) -> Optional[GymSchedule]:
        return self.repo.get_by_id(schedule_id)

    def get_by_trainer(self, trainer_id: UUID) -> List[GymSchedule]:
        return self.repo.get_by_trainer(trainer_id)


