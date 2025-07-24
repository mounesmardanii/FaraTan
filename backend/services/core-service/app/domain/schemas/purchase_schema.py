from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class PlanPurchaseResponseSchema(BaseModel):
    id: UUID
    member_id: UUID
    session_id: UUID
    amount: float
    status: str
    payment_method:str
    paid_at: datetime

    class Config:
        from_attributes = True

class ManualPurchaseCreateSchema(BaseModel):
    member_id: UUID
    session_id: UUID
    amount: float
    payment_method: str


class ManualPurchaseUpdateSchema(BaseModel):
    session_id: Optional[UUID] = None
    payment_method: Optional[str] =None
    member_id: Optional[UUID] = None 