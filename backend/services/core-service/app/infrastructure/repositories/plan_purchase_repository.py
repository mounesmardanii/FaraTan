from typing import Annotated, Optional
from uuid import UUID
from app.core.postgres_db.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from app.domain.models.plan_purchase_model import PlanPurchase
from datetime import datetime

class PlanPurchaseRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create_session_purchase(self, purchase: PlanPurchase) -> PlanPurchase:
        self.db.add(purchase)
        self.db.commit()
        self.db.refresh(purchase)
        return purchase
    
    def get_purchase_by_id(self, purchase_id: UUID):
        return self.db.query(PlanPurchase).filter(PlanPurchase.id == purchase_id).first()
    

    def update_status(self, purchase_id: UUID, new_status: str) -> Optional[PlanPurchase]:
        purchase = self.db.query(PlanPurchase).filter_by(id=purchase_id).first()
        if purchase:
            purchase.status = new_status
            if new_status == "Paid":
                purchase.paid_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(purchase)
        return purchase
