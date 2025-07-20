from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

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
