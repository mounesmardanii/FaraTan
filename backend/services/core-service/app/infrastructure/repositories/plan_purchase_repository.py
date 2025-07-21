from typing import Annotated, Optional, List
from uuid import UUID
from app.core.postgres_db.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from app.domain.models.plan_purchase_model import PlanPurchase, PlanSession, Plan
from datetime import datetime
from sqlalchemy import func


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

    def get_purchases_by_member_id(self, member_id: UUID) -> List[PlanPurchase]:
        return self.db.query(PlanPurchase).filter_by(member_id=member_id).all()
    
    def get_purchase_by_session_id(self, session_id: UUID) -> List[PlanPurchase]:
        return self.db.query(PlanPurchase).filter_by(session_id=session_id).all()
    
    def get_all_purchases(self) -> List[PlanPurchase]:
        return self.db.query(PlanPurchase).all()
    


    def get_purchase_counts_by_plan(self) -> List[dict]:
        results = (
        self.db.query(
            Plan.name.label("plan_name"),
            func.count(PlanPurchase.id).label("purchase_count")
        )
        .outerjoin(PlanSession, PlanSession.plan_id == Plan.id)
        .outerjoin(PlanPurchase, PlanPurchase.session_id == PlanSession.id)
        .group_by(Plan.id, Plan.name)
        .all()
        )

        return [{"plan_name": r.plan_name, "purchase_count": r.purchase_count} for r in results]
    

    def get_purchases_by_member(self, member_id: UUID):
        results = (
            self.db.query(Plan.id)
            .select_from(PlanPurchase)
            .join(PlanSession, PlanSession.id == PlanPurchase.session_id)
            .join(Plan, Plan.id == PlanSession.plan_id)
            .filter(
                PlanPurchase.member_id == member_id,
                PlanPurchase.status == "Paid",
                PlanSession.is_active == True
            )
            .distinct()
            .all()
        )
        return [r[0] for r in results]


