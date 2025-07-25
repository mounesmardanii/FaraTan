from fastapi import Depends, status, APIRouter
from typing import Annotated, List
from loguru import logger

from app.domain.schemas.token_schema import TokenSchema
from app.services.auth_services.auth_service import get_current_admin
from app.services.stats_main_Service import StatMainService
from app.domain.schemas.stats_schema import MemberGrowthStatSchema
from app.domain.schemas.schedule_schema import GymScheduleResponseSchema
admin_router = APIRouter()

@admin_router.get("/member-growth", response_model=List[MemberGrowthStatSchema], status_code=status.HTTP_200_OK)
async def get_member_growth(
    service: Annotated[StatMainService, Depends()],
    current_admin: Annotated[dict, Depends(get_current_admin)]
):
    return await service.get_member_growth_stats()


@admin_router.get("/weekly-schedule")
async def get_weekly_schedule(
    service: Annotated[StatMainService, Depends()]
):
    return await service.get_weekly_schedule()

@admin_router.get("/revenue-this-month", response_model=float)
async def get_revenue_this_month(
    service: Annotated[StatMainService, Depends()]
):
    return await service.get_revenue_this_month()
