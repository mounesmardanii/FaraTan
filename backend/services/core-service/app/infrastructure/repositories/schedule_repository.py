from sqlalchemy.orm import Session
from typing import List, Optional, Annotated
from uuid import UUID
from app.domain.models.schedule_model import GymSchedule, PlanSession
from app.core.postgres_db.database import get_db
from fastapi import Depends


class GymScheduleRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create(self, schedule: GymSchedule) -> GymSchedule:
        self.db.add(schedule)
        self.db.commit()
        self.db.refresh(schedule)
        return schedule

    def get_by_id(self, schedule_id: UUID) -> Optional[GymSchedule]:
        return self.db.query(GymSchedule).filter_by(id=schedule_id).first()
    
    def get_by_session_id(self, session_id: UUID) -> Optional[GymSchedule]:
        return self.db.query(GymSchedule).filter_by(session_id=session_id).first()
    
    def get_by_trainer(self, trainer_id: UUID) -> List[GymSchedule]:
        schedules = []
        sessions = self.db.query(PlanSession).filter_by(trainer_id=trainer_id).all()
        for session in sessions:
            session_schedules = self.db.query(GymSchedule).filter_by(session_id=session.id).all()
            schedules.extend(session_schedules)
        return schedules


    def update(self, schedule_id: UUID, update_fields: dict) -> GymSchedule:
        self.db.query(GymSchedule).filter(GymSchedule.id == schedule_id).update(update_fields)
        self.db.commit()
        return self.get_by_id(schedule_id)
    def get_schedules_for_week(self, start_of_week, end_of_week):
        # فیلتر سشن‌ها بر اساس تاریخ (شروع و پایان هفته)
        return self.db.query(GymSchedule).filter(
            GymSchedule.weekday >= start_of_week,
            GymSchedule.weekday <= end_of_week
        ).all()