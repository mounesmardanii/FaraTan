from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from datetime import date

class ManualPurchaseCreateSchema(BaseModel):
    member_id: UUID
    plan_id: UUID
    session_count: int
    amount: float
    payment_method: str
    paid_at : date

class ManualPurchaseUpdateSchema(BaseModel):
    amount: Optional[int] = None
    plan_id: Optional[UUID] = None
    payment_method: Optional[str] =None
    member_id: Optional[UUID] = None 
    session_count: Optional[int] = None

class PlanPurchaseResponseSchema(BaseModel):
    id: UUID
    member_id: UUID
    plan_id: UUID
    session_count: int
    amount: float
    status: str
    payment_method:str
    
    paid_at: datetime

    class Config:
        from_attributes = True

