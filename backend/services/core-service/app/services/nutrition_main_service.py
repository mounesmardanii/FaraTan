from app.domain.schemas.nutrition_schema import CreateNutritionWeekSchema, NutritionWeekResponseSchema, CreateDayWithMealsSchema, DayWithMealsResponseSchema, NutritionMealResponseSchema
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
    
    async def create_day_with_meals(self, data: CreateDayWithMealsSchema) -> DayWithMealsResponseSchema:
        day = await self.service.create_day_with_meals(data)
        meals = self.service.get_meals_by_day(day.id)
        return DayWithMealsResponseSchema(
            id=day.id,
            week_id=day.week_id,
            day_of_week=day.day_of_week,
            meals=[NutritionMealResponseSchema.from_orm(m) for m in meals]
        )