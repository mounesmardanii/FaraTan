from uuid import UUID
from typing import List, Annotated
from fastapi import Depends
from app.services.plan_purchase_service import PlanPurchaseService
from app.domain.schemas.purchase_schema import PlanPurchaseResponseSchema

class PlanPurchaseMainService:
    def __init__(self, service: Annotated[PlanPurchaseService, Depends()]):
        self.service = service

    async def get_my_purchases(self, member_id: UUID) -> List[PlanPurchaseResponseSchema]:
        purchases = await self.service.get_purchases_by_member_id(member_id)
        return [PlanPurchaseResponseSchema.from_orm(p) for p in purchases]
