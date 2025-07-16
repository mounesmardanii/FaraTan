from fastapi import Depends, status, APIRouter
from typing import Annotated, List
from loguru import logger
from app.domain.schemas.nutrition_schema import CreateNutritionWeekSchema, NutritionWeekResponseSchema
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