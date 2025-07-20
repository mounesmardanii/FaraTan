from app.infrastructure.repositories.plan_purchase_repository import PlanPurchaseRepository
from app.domain.models.plan_purchase_model import PlanPurchase
from app.domain.models.plan_model import Plan
from typing import List, Optional, Annotated
from uuid import UUID
from fastapi import Depends

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

