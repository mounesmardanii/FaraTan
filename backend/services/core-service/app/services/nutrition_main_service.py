from app.domain.schemas.nutrition_schema import(
CreateNutritionWeekSchema,
NutritionWeekResponseSchema,
CreateNutritionDaySchema,
UpdateNutritionDaySchema,
NutritionDayResponseSchema,
UpdateWeekTitleSchema,
NutritionWeekPlanResponseSchema,
NutritionDayPlanResponseSchema
)
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

    async def update_week_title(self, week_id: UUID, data: UpdateWeekTitleSchema):
        return await self.service.update_week_title(week_id, data.title)
    
    async def create_day(self, data: CreateNutritionDaySchema) -> NutritionDayResponseSchema:
        day = await self.service.create_day(data)
        return NutritionDayResponseSchema.from_orm(day)

    async def get_day(self, day_id: UUID) -> NutritionDayResponseSchema:
        day = await self.service.get_day_by_id(day_id)
        return NutritionDayResponseSchema.from_orm(day)

    async def update_day(self, day_id: UUID, data: UpdateNutritionDaySchema) -> NutritionDayResponseSchema:
        day = await self.service.update_day(day_id, data)
        return NutritionDayResponseSchema.from_orm(day)

    async def get_week_plan(self, week_id: UUID) -> NutritionWeekPlanResponseSchema:
        days = await self.service.get_week_plan(week_id)
        return NutritionWeekPlanResponseSchema(
            week_id=week_id,
            days=[NutritionDayPlanResponseSchema.from_orm(day) for day in days]
        )
