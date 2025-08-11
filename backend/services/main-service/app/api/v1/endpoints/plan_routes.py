from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from app.services.plan_main_service import PlanMainService
from app.domain.schemas.plan_schema import PlanResponseSchema, PlanCreateSchema, PlanUpdateSchema
from typing import Annotated
from uuid import UUID

plan_router = APIRouter()

@plan_router.get("/all-plans", response_model=List[PlanResponseSchema], status_code=status.HTTP_200_OK)
async def get_all_plans(service: Annotated[PlanMainService, Depends()]):
    return await service.get_all_plans()

@plan_router.post("/", response_model=PlanResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_plan(
    data: PlanCreateSchema,
    service: Annotated[PlanMainService, Depends()]
):
    return await service.create_plan(data)

@plan_router.put("/{plan_id}", response_model=PlanResponseSchema)
async def update_plan(
    plan_id: UUID,
    data: PlanUpdateSchema,
    service: Annotated[PlanMainService, Depends()]
):
    return await service.update(plan_id, data)
