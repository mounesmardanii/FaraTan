from pydantic import BaseModel
from uuid import UUID

class PlanResponseSchema(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True
