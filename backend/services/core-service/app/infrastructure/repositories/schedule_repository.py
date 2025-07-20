from sqlalchemy.orm import Session
from typing import List, Optional, Annotated
from uuid import UUID
from app.domain.models.schedule_model import GymSchedule
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

