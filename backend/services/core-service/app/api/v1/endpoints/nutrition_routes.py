from fastapi import Depends, status, APIRouter
from typing import Annotated, List
from loguru import logger
from app.domain.schemas.nutrition_schema import CreateNutritionWeekSchema, NutritionWeekResponseSchema, NutritionDayResponseSchema, CreateNutritionDaySchema
from app.domain.schemas.token_schema import TokenSchema
from app.services.auth_services.auth_service import AuthService
from uuid import UUID
from app.services.auth_services.auth_service import get_current_admin
from app.services.nutrition_main_service import NutritionMainService
from app.domain.schemas.token_schema import TokenSchema, TokenDataSchema
nutrition_router = APIRouter()


@nutrition_router.post("/weeks", status_code=status.HTTP_200_OK, response_model=NutritionWeekResponseSchema)
async def create_week(
    data: CreateNutritionWeekSchema,
    service: Annotated[NutritionMainService, Depends()],
    current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)]
):
    return await service.create_week(data)



@nutrition_router.get("/members/{member_id}/weeks", status_code=status.HTTP_200_OK, response_model=List[NutritionWeekResponseSchema])
async def list_member_weeks(
    member_id: UUID,
    service: Annotated[NutritionMainService, Depends()],
    current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)]
):
    return await service.get_weeks_by_member(member_id)



@nutrition_router.delete("/weeks/{week_id}", status_code=status.HTTP_200_OK)
async def delete_week(
    week_id: UUID,
    service: Annotated[NutritionMainService, Depends()],
    current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)]
):
    await service.delete_week(week_id)
    return {"message": "Week deleted successfully"}



@nutrition_router.post("/days", response_model=NutritionDayResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_day(
    data: CreateNutritionDaySchema,
    nutrition_service: Annotated[NutritionMainService, Depends()],
    current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)]
):
    return await nutrition_service.create_day(data)


@nutrition_router.get("/weeks/{week_id}/days", response_model=List[NutritionDayResponseSchema])
async def get_days_by_week(
    week_id: UUID,
    nutrition_service: Annotated[NutritionMainService, Depends()],
    current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)]
):
    return await nutrition_service.get_days_by_week(week_id)