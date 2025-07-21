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
    is_active:bool

    class Config:
        from_attributes = True

class PlanSessionUpdateSchema(BaseModel):
    plan_id: Optional[UUID] = None
    trainer_id: Optional[UUID]= None
    capacity: Optional[int]= None
    session_count: Optional[int]= None
    price: Optional[int]= None