from app.infrastructure.repositories.plan_purchase_repository import PlanPurchaseRepository
from app.domain.models.plan_purchase_model import PlanPurchase
from typing import List, Optional, Annotated
from uuid import UUID
from fastapi import Depends
from app.domain.schemas.purchase_schema import ManualPurchaseCreateSchema
from datetime import datetime
from app.utils.date_helper import get_start_and_end_of_month

class PlanPurchaseService:
    def __init__(self, repo: Annotated[PlanPurchaseRepository, Depends()]):
        self.repo = repo

    async def create_session_purchase(self, member_id: UUID, session_id: UUID, amount: int) -> PlanPurchase:
        purchase = PlanPurchase(
            member_id=member_id,
            session_id=session_id,
            amount=amount
        )
        return self.repo.create_session_purchase(purchase)
    
    async def get_purchase_by_id(self, purchase_id: UUID):
        return self.repo.get_purchase_by_id(purchase_id)
    
    async def update_status(self, purchase_id: UUID, new_status: str) -> Optional[PlanPurchase]:
        return self.repo.update_status(purchase_id, new_status)
    
    async def get_purchases_by_member_id(self, member_id: UUID) -> List[PlanPurchase]:
        return self.repo.get_purchases_by_member_id(member_id)

    async def get_purchase_by_session_id(self, session_id: UUID):
        return self.repo.get_purchase_by_session_id(session_id)
    
    async def get_all_purchases(self):
        return self.repo.get_all_purchases()
    
    async def get_plan_purchase_counts(self):
        return self.repo.get_purchase_counts_by_plan()

    async def get_purchased_plans_by_member(self, member_id: UUID) -> List[PlanPurchase]:
        return self.repo.get_purchased_plans_by_member(member_id)
    
    async def create_manual_purchase(self, data: ManualPurchaseCreateSchema):
        return self.repo.create_manual_purchase(
            member_id=data.member_id,
            session_id=data.session_id,
            amount=data.amount,
            payment_method=data.payment_method,
            paid_at=datetime.utcnow()
        )
    
    
    async def mark_as_canceled(self, purchase: PlanPurchase):
        return self.repo.mark_as_canceled(purchase)
    

    async def get_revenue_this_month(self):
        start_of_month, end_of_month = get_start_and_end_of_month()
        
        return self.repo.get_revenue_this_month(start_of_month, end_of_month)
            
    async def get_active_members_count(self):
        return self.repo.get_active_members_count()