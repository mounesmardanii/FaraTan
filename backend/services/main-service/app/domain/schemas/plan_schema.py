from pydantic import BaseModel
from uuid import UUID

class PlanResponseSchema(BaseModel):
    id: UUID
    name: str
    session_count: int
    price: float
    
    class Config:
        from_attributes = True

class PlanCreateSchema(BaseModel):
    name: str
    session_count: int
    price: float

    class Config:
        from_attributes = True
        