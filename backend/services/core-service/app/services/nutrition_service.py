from app.domain.models.nutrition_model import NutritionWeek,NutritionDay, NutritionMeal
from app.infrastructure.repositories.nutrition_repository import NutritionRepository
from typing import Annotated, List
from loguru import logger
from fastapi import Depends, HTTPException
from app.domain.schemas.nutrition_schema import CreateNutritionWeekSchema, CreateDayWithMealsSchema
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

    async def create_day_with_meals(self, data: CreateDayWithMealsSchema) -> NutritionDay:
        return self.repo.create_day_with_meals(data.week_id, data.day_of_week, data.meals)
    
    async def get_meals_by_day(self, day_id: UUID) -> List[NutritionMeal]:
        return self.repo.get_meals_by_day(day_id)
    
    async def get_days_with_meals(self, week_id: UUID) -> List[NutritionDay]:
        return self.repo.get_days_with_meals(week_id)
    

    async def get_days_by_week_id(self, week_id: UUID) -> List[NutritionDay]:
        return self.repo.get_days_by_week_id(week_id)
    
    def update_week_title(self, week_id: UUID, new_title: str) -> dict:
        week = self.repo.get_week_by_id(week_id)
        if not week:
            raise HTTPException(status_code=404, detail="Week not found")
        self.repo.update_week_title(week_id, new_title)
        return {"detail": "Week title updated successfully"}