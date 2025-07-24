from uuid import UUID
from typing import List, Annotated
from fastapi import Depends
from app.services.plan_purchase_service import PlanPurchaseService
from app.domain.schemas.purchase_schema import PlanPurchaseResponseSchema, ManualPurchaseCreateSchema
from app.services.plan_service import PlanService
from app.services.plan_session_service import PlanSessionService

class PlanPurchaseMainService:
    def __init__(self,
        service: Annotated[PlanPurchaseService, Depends()],
        plan_service: Annotated[PlanService, Depends()],
        session_service: Annotated[PlanSessionService, Depends()]
        ):
        self.service = service
        self.plan_service = plan_service
        self.session_service = session_service

    async def get_my_purchases(self, member_id: UUID) -> List[PlanPurchaseResponseSchema]:
        purchases = await self.service.get_purchases_by_member_id(member_id)
        return [PlanPurchaseResponseSchema.from_orm(p) for p in purchases]
    
    async def get_all_purchases(self) -> List[PlanPurchaseResponseSchema]:
        purchases = await self.service.get_all_purchases()
        return [PlanPurchaseResponseSchema.from_orm(p) for p in purchases]
    

    async def get_purchase_stats(self):
        return await self.service.get_plan_purchase_counts()
    
    async def get_my_purchased_plans(self, member_id: UUID):
        return await self.service.get_purchased_plans_by_member(member_id)


    async def create_manual_purchase(self, data: ManualPurchaseCreateSchema):
        return await self.service.create_manual_purchase(data)