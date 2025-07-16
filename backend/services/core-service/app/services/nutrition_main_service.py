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
