from fastapi import Depends, HTTPException
from typing import Annotated
from app.services.plan_service import PlanService
from app.domain.schemas.plan_schema import PlanUpdateSchema, PlanResponseSchema
from uuid import UUID
class PlanMainService:
    def __init__(
        self,
        plan_service: Annotated[PlanService, Depends()],
    ):
        self.service = plan_service

    async def get_all_plans(self):
        return await self.service.get_all_plans()

    async def get_plan_by_id(self, plan_id):
        return await self.service.get_plan_by_id(plan_id)
    
    async def create_plan(self, data)-> PlanResponseSchema:
        new = await self.service.create_plan(data)
        return PlanResponseSchema.from_orm(new)
    
    async def update(self, plan_id: UUID, data: PlanUpdateSchema) -> PlanResponseSchema:
        plan = await self.service.get_plan_by_id(plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found.")
        update_data = data.model_dump(exclude_unset=True)  

        update_fields = {key: value for key, value in update_data.items() if value != ""}  


        updated = await self.service.update(plan_id, update_fields)
        return PlanResponseSchema.from_orm(updated)