from pydantic import BaseModel
from uuid import UUID
from typing import Optional

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
        

class PlanUpdateSchema(BaseModel):
    name: Optional[str] = None
    session_count: Optional[int] = None
    price: Optional[float] = None

    class Config:
        from_attributes = True        