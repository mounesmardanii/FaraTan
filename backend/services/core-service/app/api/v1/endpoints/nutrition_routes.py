from fastapi import Depends, status, APIRouter
from typing import Annotated, List
from loguru import logger
from app.domain.schemas.nutrition_schema import(
CreateNutritionWeekSchema,
NutritionWeekResponseSchema,
UpdateWeekTitleSchema,
CreateNutritionDaySchema,
UpdateNutritionDaySchema,
NutritionDayResponseSchema,
)
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


@nutrition_router.put("/weeks/{week_id}/title", status_code=status.HTTP_200_OK)
async def update_week_title(
    week_id: UUID,
    request: UpdateWeekTitleSchema,
    service: Annotated[NutritionMainService, Depends()],
    current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)]
):
    return await service.update_week_title(week_id, request)


@nutrition_router.post(
    "/days",
    status_code=status.HTTP_201_CREATED,
    response_model=NutritionDayResponseSchema
)
async def create_nutrition_day(
    data: CreateNutritionDaySchema,
    service: Annotated[NutritionMainService, Depends()]
):
    return await service.create_day(data)


@nutrition_router.put(
    "/days/{day_id}",
    status_code=status.HTTP_200_OK,
    response_model=NutritionDayResponseSchema
)
async def update_nutrition_day(
    day_id: UUID,
    data: UpdateNutritionDaySchema,
    service: Annotated[NutritionMainService, Depends()]
):
    return await service.update_day(day_id, data)
