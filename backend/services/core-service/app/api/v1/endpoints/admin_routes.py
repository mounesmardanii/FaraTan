from fastapi import Depends, status, APIRouter
from typing import Annotated, List
from loguru import logger
from app.services.stats_main_service import StatMainService
from app.domain.schemas.stats_schema import MemberGrowthStatSchema

admin_router = APIRouter()

@admin_router.get("/member-growth", response_model=List[MemberGrowthStatSchema], status_code=status.HTTP_200_OK)
async def get_member_growth(
    service: Annotated[StatMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)]
):
    return await service.get_member_growth_stats()


@admin_router.get("/weekly-schedule", status_code=status.HTTP_200_OK)
async def get_weekly_schedule(
    service: Annotated[StatMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)]
):
    return await service.get_weekly_schedule()

@admin_router.get("/revenue-this-month", response_model=float, status_code=status.HTTP_200_OK)
async def get_revenue_this_month(
    service: Annotated[StatMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)]
):
    return await service.get_revenue_this_month()

@admin_router.get("/active-members-count", response_model=int, status_code=status.HTTP_200_OK)
async def get_active_members_count(
    service: Annotated[StatMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)]
):
    return await service.get_active_members_count()

@admin_router.get("/active-trainers-count", response_model=int, status_code=status.HTTP_200_OK)
async def get_active_trainers_count(
    service: Annotated[StatMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)]
):
    return await service.get_active_trainers_count()
