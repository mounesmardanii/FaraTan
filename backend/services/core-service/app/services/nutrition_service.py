from app.domain.models.nutrition_model import NutritionWeek,NutritionDay
from app.infrastructure.repositories.nutrition_repository import NutritionRepository
from typing import Annotated, List
from loguru import logger
from fastapi import Depends
from app.domain.schemas.nutrition_schema import CreateNutritionWeekSchema, CreateNutritionDaySchema
from uuid import UUID


class NutritionService:
    def __init__(self, repo: Annotated[NutritionRepository, Depends()]):
        self.repo = repo

    async def create_week(self, data: CreateNutritionWeekSchema) -> NutritionWeek:
        week = NutritionWeek(member_id=data.member_id, title=data.title)
        return self.repo.create_week(week)

    async def get_weeks_by_member(self, member_id: UUID) -> List[NutritionWeek]:
        return self.repo.get_weeks_by_member(member_id)

    async def delete_week(self, week_id: UUID) -> None:
        self.repo.delete_week(week_id)


    async def create_day(self, data: CreateNutritionDaySchema) -> NutritionDay:
        day = NutritionDay(week_id=data.week_id, day_of_week=data.day_of_week)
        return self.repo.create_day(day)

    async def get_days_by_week(self, week_id: UUID) -> List[NutritionDay]:
        return self.repo.get_days_by_week_id(week_id)
