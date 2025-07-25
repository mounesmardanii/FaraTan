from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, time, date
from typing import Optional, List

class GymScheduleCreateSchema(BaseModel):
    session_id: UUID
    sport_id: UUID
    weekday: date
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
    weekday: date
    start_time: time
    end_time: time
    created_at: datetime

    class Config:
        from_attributes = True


class WeekdayScheduleResponseSchema(BaseModel):
    weekday: str
    schedules: List[GymScheduleResponseSchema]

    class Config:
        from_attributes = True
