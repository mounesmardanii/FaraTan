from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class GymSportsResponseSchema(BaseModel):
    id: UUID
    name: str
    created_at: datetime

    class Config:
        from_attributes = True
