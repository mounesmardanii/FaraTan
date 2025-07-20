from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, time
from typing import Optional

class GymScheduleCreateSchema(BaseModel):
    session_id: UUID
    sport_id: UUID
    weekday: str
    start_time: time
    end_time: time

class GymScheduleUpdateSchema(BaseModel):
    weekday: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None

class GymScheduleResponseSchema(BaseModel):
    id: UUID
    session_id: UUID
    sport_id: UUID
    weekday: str
    start_time: time
    end_time: time
    created_at: datetime

    class Config:
        from_attributes = True
