from typing import List, Optional, Annotated
from uuid import UUID
from fastapi import Depends, HTTPException
from app.infrastructure.repositories.schedule_repository import GymScheduleRepository
from app.domain.models.schedule_model import GymSchedule
from app.domain.schemas.schedule_schema import GymScheduleCreateSchema
from app.utils.date_helper import get_start_and_end_of_week

class GymScheduleService:
    def __init__(self, repo: Annotated[GymScheduleRepository, Depends()]):
        self.repo = repo

    async def create(self, data: GymScheduleCreateSchema) -> GymSchedule:
        schedule = GymSchedule(
          session_id=data.session_id, 
          sport_id=data.sport_id, 
          weekday=data.weekday, 
          capacity=data.capacity,
          start_time=data.start_time, 
          end_time=data.end_time,
        )
        return self.repo.create(schedule)

    async def get_by_id(self, schedule_id: UUID) -> Optional[GymSchedule]:
        return self.repo.get_by_id(schedule_id)
    
    async def get_by_session_id(self, schedule_id: UUID) -> Optional[GymSchedule]:
        return self.repo.get_by_session_id(schedule_id)
    
    async def get_by_trainer(self, trainer_id: UUID) -> List[GymSchedule]:
        return self.repo.get_by_trainer(trainer_id)

    async def update(self, schedule_id: UUID, update_fields: dict) -> Optional[GymSchedule]:
        return self.repo.update(schedule_id, update_fields)
    
    async def get_weekly_schedule(self):
        start_of_week, end_of_week = get_start_and_end_of_week()
        schedules = self.repo.get_schedules_for_week(start_of_week, end_of_week)

        weekly_schedule = []

        for schedule in schedules:
            weekly_schedule.append({
                'id': schedule.id,
                'session_id': schedule.session_id,
                'sport_id': schedule.sport_id,
                'weekday': schedule.weekday,
                'capacity': schedule.capacity,
                'start_time': schedule.start_time,
                'end_time': schedule.end_time,
                'created_at': schedule.created_at  
            })
        
        return weekly_schedule