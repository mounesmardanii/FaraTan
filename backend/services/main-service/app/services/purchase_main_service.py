from uuid import UUID
from typing import List, Annotated
from fastapi import Depends, HTTPException
from app.services.plan_purchase_service import PlanPurchaseService
from app.domain.schemas.purchase_schema import PlanPurchaseResponseSchema, ManualPurchaseCreateSchema, ManualPurchaseUpdateSchema
from app.services.plan_service import PlanService

class PlanPurchaseMainService:
    def __init__(self,
        service: Annotated[PlanPurchaseService, Depends()],
        plan_service: Annotated[PlanService, Depends()],
        ):
        self.service = service
        self.plan_service = plan_service

    async def get_member_purchases(self, member_id: UUID) -> List[PlanPurchaseResponseSchema]:
        purchases = await self.service.get_purchases_by_member_id(member_id)
        return [PlanPurchaseResponseSchema.from_orm(p) for p in purchases]
    
    async def get_all_purchases(self) -> List[PlanPurchaseResponseSchema]:
        purchases = await self.service.get_all_purchases()
        return [PlanPurchaseResponseSchema.from_orm(p) for p in purchases]
    

    async def get_purchase_stats(self):
        return await self.service.get_plan_purchase_counts()
    
    async def create_manual_purchase(self, data: ManualPurchaseCreateSchema):
        return await self.service.create_manual_purchase(data)
    

    async def update_manual_purchase(self, purchase_id: UUID, data: ManualPurchaseUpdateSchema):
        purchase = await self.service.get_purchase_by_id(purchase_id)
        if not purchase:
            raise HTTPException(status_code=404, detail="Purchase not found")

        return await self.service.update(purchase_id, data)

    async def cancel_manual_purchase(self, purchase_id: UUID):
        purchase = await self.service.get_purchase_by_id(purchase_id)

        if purchase.status == 'Canceled':
            raise HTTPException(status_code=403, detail="Already canceled.")

        return self.service.mark_as_canceled(purchase)