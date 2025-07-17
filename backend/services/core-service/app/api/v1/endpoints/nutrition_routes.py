from fastapi import Depends, status, APIRouter
from typing import Annotated, List
from loguru import logger
from app.domain.schemas.nutrition_schema import CreateNutritionWeekSchema, NutritionWeekResponseSchema,CreateDayWithMealsSchema, DayWithMealsResponseSchema
from app.domain.schemas.token_schema import TokenSchema
from app.services.auth_services.auth_service import AuthService
from uuid import UUID
from app.services.auth_services.auth_service import get_current_admin, get_current_member
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



@nutrition_router.get("/my-weeks", status_code=status.HTTP_200_OK, response_model=List[NutritionWeekResponseSchema])
async def list_member_weeks(
    service: Annotated[NutritionMainService, Depends()],
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)]
):
    return await service.get_weeks_by_member(current_member.id)



@nutrition_router.delete("/weeks/{week_id}", status_code=status.HTTP_200_OK)
async def delete_week(
    week_id: UUID,
    service: Annotated[NutritionMainService, Depends()],
    current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)]
):
    await service.delete_week(week_id)
    return {"message": "Week deleted successfully"}



@nutrition_router.post("/nutrition/weeks/days-with-meals", response_model=DayWithMealsResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_day_with_meals(
    data: CreateDayWithMealsSchema,
    service: Annotated[NutritionMainService, Depends()],
    current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)]
):
    return await service.create_day_with_meals(data)


@nutrition_router.get(
    "/weeks/{week_id}/days-with-meals",
    response_model=List[DayWithMealsResponseSchema],
    status_code=status.HTTP_200_OK
)
async def get_days_with_meals_by_week(
    week_id: UUID,
    service: Annotated[NutritionMainService, Depends()],
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)]
):
    return await service.get_days_with_meals(week_id)
