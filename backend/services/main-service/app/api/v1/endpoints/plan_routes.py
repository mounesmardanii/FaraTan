from fastapi import APIRouter, Depends, status
from typing import List
from app.services.plan_main_service import PlanMainService
from app.domain.schemas.plan_schema import PlanResponseSchema
from typing import Annotated

plan_router = APIRouter()

@plan_router.get("/all-plans", response_model=List[PlanResponseSchema], status_code=status.HTTP_200_OK)
def get_all_plans(service: Annotated[PlanMainService, Depends()]):
    return service.get_all_plans()