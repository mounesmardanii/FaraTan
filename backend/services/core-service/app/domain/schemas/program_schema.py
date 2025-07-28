from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class CreateProgramMovementSchema(BaseModel):
    movement_id: UUID
    member_id: UUID
    sets: Optional[int] = None
    duration: Optional[int] = None
    sets: Optional[int]= None
    reps: Optional[int]= None
    weight: Optional[float]= None
class ProgramMovementResponseSchema(BaseModel):
    id: UUID
    member_id: UUID
    movement_id: UUID
    sets: Optional[int]
    reps: Optional[int]
    weight: Optional[float]
    duration: Optional[int]

    class Config:
        from_attributes = True
