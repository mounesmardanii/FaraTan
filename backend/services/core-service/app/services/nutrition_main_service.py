from app.domain.schemas.nutrition_schema import CreateNutritionWeekSchema, NutritionWeekResponseSchema
from typing import Annotated, Dict, Optional, List
from loguru import logger
from fastapi import Depends, HTTPException, status
from datetime import date
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
