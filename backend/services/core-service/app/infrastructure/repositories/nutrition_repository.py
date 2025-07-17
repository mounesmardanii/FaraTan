from typing import Annotated, Optional, List
from loguru import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.schemas.nutrition_schema import MealInputSchema
from app.domain.models.nutrition_model import NutritionWeek, NutritionDay, NutritionMeal
from uuid import UUID

class NutritionRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create_week(self, week: NutritionWeek) -> NutritionWeek:
        self.db.add(week)
        self.db.commit()
        self.db.refresh(week)
        return week

    def get_week_by_id(self, week_id: UUID) -> Optional[NutritionWeek]:
        return self.db.query(NutritionWeek).filter(NutritionWeek.id == week_id).first()

    def get_weeks_by_member(self, member_id: UUID) -> List[NutritionWeek]:
        return self.db.query(NutritionWeek).filter(NutritionWeek.member_id == member_id).order_by(NutritionWeek.created_at.desc()).all()

    def delete_week(self, week_id: UUID) -> None:
        week = self.get_week_by_id(week_id)
        if week:
            self.db.delete(week)
            self.db.commit()
    def create_day(self, day: NutritionDay) -> NutritionDay:
            self.db.add(day)
            self.db.commit()
            self.db.refresh(day)
            return day

    def get_days_by_week_id(self, week_id: UUID) -> List[NutritionDay]:
        return self.db.query(NutritionDay).filter(NutritionDay.week_id == week_id).all()
    


    def create_day_with_meals(self, week_id: UUID, day_of_week: str, meals: List[MealInputSchema]) -> NutritionDay:
        new_day = NutritionDay(week_id=week_id, day_of_week=day_of_week)
        self.db.add(new_day)
        self.db.flush()   

        for meal in meals:
            self.db.add(NutritionMeal(
                day_id=new_day.id,
                meal_type=meal.meal_type,
                meal_description=meal.meal_description
            ))

        self.db.commit()
        self.db.refresh(new_day)
        return new_day
    def get_meals_by_day(self, day_id: UUID) -> List[NutritionMeal]:
        return self.db.query(NutritionMeal).filter(NutritionMeal.day_id == day_id).all()