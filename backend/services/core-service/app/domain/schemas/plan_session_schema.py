from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class PlanSessionCreateSchema(BaseModel):
    plan_id: UUID
    trainer_id: UUID
    capacity: int
    session_count: int
    price: int

class PlanSessionResponseSchema(PlanSessionCreateSchema):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
