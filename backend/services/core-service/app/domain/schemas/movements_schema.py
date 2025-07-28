from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class CreateMovementSchema(BaseModel):
    title: str

class MovementResponseSchema(BaseModel):
    id: UUID
    title: str
    video_url: Optional[str]
    is_vip: bool
    created_at: datetime

    class Config:
        from_attributes = True
