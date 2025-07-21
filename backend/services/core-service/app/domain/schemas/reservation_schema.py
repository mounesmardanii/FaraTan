from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, time
from typing import Optional

class ReservationResponseSchema(BaseModel):
    id: UUID
    session_id: UUID
    member_id: UUID
    session_schedule_id:UUID
    reserved_at: datetime
    status: str

    class Config:
        from_attributes = True
