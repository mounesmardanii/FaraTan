from fastapi import APIRouter, Depends, status
from typing import List
from app.services.plan_main_service import PlanMainService
from app.domain.schemas.plan_schema import PlanResponseSchema, PlanCreateSchema
from typing import Annotated

plan_router = APIRouter()

@plan_router.get("/all-plans", response_model=List[PlanResponseSchema], status_code=status.HTTP_200_OK)
def get_all_plans(service: Annotated[PlanMainService, Depends()]):
    return service.get_all_plans()

@plan_router.post("/", response_model=PlanResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_plan(
    data: PlanCreateSchema,
    service: Annotated[PlanMainService, Depends()]
):
    return await service.create_plan(data)
