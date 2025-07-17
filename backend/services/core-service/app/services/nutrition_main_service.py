from app.domain.schemas.nutrition_schema import CreateNutritionWeekSchema, NutritionWeekResponseSchema, NutritionDayResponseSchema, CreateNutritionDaySchema
from typing import Annotated, List
from loguru import logger
from fastapi import Depends
from uuid import UUID
from app.services.nutrition_service import NutritionService


class NutritionMainService:
    def __init__(self, service: Annotated[NutritionService, Depends()]):
        self.service = service

    async def create_week(self, data: CreateNutritionWeekSchema) -> NutritionWeekResponseSchema:
        return await self.service.create_week(data)

    async def get_weeks_by_member(self, member_id: UUID) -> List[NutritionWeekResponseSchema]:
        return await self.service.get_weeks_by_member(member_id)

    async def delete_week(self, week_id: UUID) -> None:
        return await self.service.delete_week(week_id)
    
    async def create_day(self, data: CreateNutritionDaySchema) -> NutritionDayResponseSchema:
        day = await self.service.create_day(data)
        return NutritionDayResponseSchema.from_orm(day)

    async def get_days_by_week(self, week_id: UUID) -> List[NutritionDayResponseSchema]:
        days = await self.service.get_days_by_week(week_id)
        return [NutritionDayResponseSchema.from_orm(d) for d in days]
