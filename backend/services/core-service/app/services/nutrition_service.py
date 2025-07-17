from app.domain.models.nutrition_model import NutritionWeek
from app.infrastructure.repositories.nutrition_repository import NutritionRepository
from typing import Annotated, Dict, Optional, List
from loguru import logger
from fastapi import Depends, HTTPException, status
from app.domain.schemas.nutrition_schema import CreateNutritionWeekSchema
from uuid import UUID


class NutritionService:
    def __init__(self, repo: Annotated[NutritionRepository, Depends()]):
        self.repo = repo

    async def create_week(self, data: CreateNutritionWeekSchema) -> NutritionWeek:
        week = NutritionWeek(member_id=data.member_id, title=data.title)
        return self.repo.create_week(week)

    async def get_weeks_by_member(self, member_id: UUID) -> List[NutritionWeek]:
        return self.repo.get_weeks_by_member(member_id)


