from typing import Annotated, Optional, List
from uuid import UUID
from app.core.postgres_db.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from app.domain.models.plan_purchase_model import PlanPurchase, Plan
from datetime import datetime
from sqlalchemy import func


class PlanPurchaseRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

  
    def get_purchase_by_id(self, purchase_id: UUID):
        return self.db.query(PlanPurchase).filter(PlanPurchase.id == purchase_id).first()

    def get_purchases_by_member_id(self, member_id: UUID) -> List[PlanPurchase]:
        return self.db.query(PlanPurchase).filter_by(member_id=member_id).all()
    
    def get_purchase_by_plan_id(self, plan_id: UUID) -> List[PlanPurchase]:
        return self.db.query(PlanPurchase).filter_by(plan_id=plan_id).all()
    
    def get_all_purchases(self) -> List[PlanPurchase]:
        return self.db.query(PlanPurchase).all()
    

    def create_manual_purchase(self, member_id, plan_id, session_count, amount, payment_method, paid_at, status):
            purchase = PlanPurchase(
                member_id=member_id,
                plan_id=plan_id,
                session_count=session_count,
                amount=amount,
                payment_method=payment_method,
                paid_at=paid_at,
                status=status
            )
            self.db.add(purchase)
            self.db.commit()
            self.db.refresh(purchase)
            return purchase
    
    
    async def update(self, purchase: PlanPurchase, update_data: dict):
        for field, value in update_data.items():
            setattr(purchase, field, value)

        self.db.add(purchase)
        await self.db.commit()
        await self.db.refresh(purchase)
        return purchase
    
    def get_revenue_this_month(self, start_of_month, end_of_month):
        total_revenue = self.db.query(func.sum(PlanPurchase.amount)).filter(
            PlanPurchase.status == "Paid", 
            PlanPurchase.paid_at >= start_of_month,
            PlanPurchase.paid_at <= end_of_month
        ).scalar() 
    
        return total_revenue if total_revenue is not None else 0.0
   
    
    def get_active_members_count(self, start_of_month, end_of_month):
        active_members_count = self.db.query(func.count(func.distinct(PlanPurchase.member_id))).filter(
                    PlanPurchase.status == "Paid", 
                    PlanPurchase.paid_at >= start_of_month,
                    PlanPurchase.paid_at <= end_of_month
                ).scalar()
        return active_members_count if active_members_count is not None else 0
    
    def get_purchase_counts_by_plan(self) -> List[dict]:
        results = (
        self.db.query(
            Plan.name.label("plan_name"),
            func.count(PlanPurchase.id).label("purchase_count")
        )
        .group_by(Plan.id, Plan.name)
        .all()
        )

        return [{"plan_name": r.plan_name, "purchase_count": r.purchase_count} for r in results]