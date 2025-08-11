from app.infrastructure.repositories.plan_purchase_repository import PlanPurchaseRepository
from app.domain.models.plan_purchase_model import PlanPurchase
from typing import List, Optional, Annotated
from uuid import UUID
from fastapi import Depends
from datetime import datetime
from app.utils.date_helper import get_start_and_end_of_month
from app.domain.schemas.purchase_schema import  ManualPurchaseCreateSchema, ManualPurchaseUpdateSchema

class PlanPurchaseService:
    def __init__(self, repo: Annotated[PlanPurchaseRepository, Depends()]):
        self.repo = repo

    async def get_purchase_by_id(self, purchase_id: UUID):
        return self.repo.get_purchase_by_id(purchase_id)
        
    async def update(self,purchase_id: UUID, data: ManualPurchaseUpdateSchema):
        purchase = await self.repo.get_purchase_by_id(purchase_id)

        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(purchase, field, value)

        await self.repo.update(purchase)
        return purchase
    
    
    async def get_purchases_by_member_id(self, member_id: UUID) -> List[PlanPurchase]:
        return self.repo.get_purchases_by_member_id(member_id)

    async def get_purchase_by_plan_id(self, plan_id: UUID):
        return self.repo.get_purchase_by_plan_id(plan_id)
    
    async def get_all_purchases(self):
        return self.repo.get_all_purchases()
    
    async def get_plan_purchase_counts(self):
        return self.repo.get_purchase_counts_by_plan()

    
    async def create_manual_purchase(self, data: ManualPurchaseCreateSchema):
    
        return self.repo.create_manual_purchase(
            member_id=data.member_id,
            plan_id=data.plan_id,
            session_count=data.session_count,
            amount=data.amount,
            payment_method=data.payment_method,
            paid_at= datetime.utcnow(),
            status= "Paid"
        )
    

    async def get_revenue_this_month(self):
        start_of_month, end_of_month = get_start_and_end_of_month()
        
        return self.repo.get_revenue_this_month(start_of_month, end_of_month)
            
    async def get_active_members_count(self):
        start_of_month, end_of_month = get_start_and_end_of_month()
        return self.repo.get_active_members_count(start_of_month, end_of_month)
    
    async def mark_as_canceled(self, purchase: PlanPurchase):
        return self.repo.mark_as_canceled(purchase)
    