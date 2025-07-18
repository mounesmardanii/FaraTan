from typing import Annotated, Optional, List
from loguru import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.schemas.nutrition_schema import MealInputSchema, CreateNutritionDaySchema,UpdateNutritionDaySchema
from app.domain.models.nutrition_model import NutritionWeek, NutritionDay
from uuid import UUID
from sqlalchemy.orm import selectinload
from fastapi import HTTPException


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
    
    def get_day_by_id(self, day_id: UUID) -> Optional[NutritionDay]:
        return self.db.query(NutritionDay).filter(NutritionDay.id == day_id).first()

    def create_day(self, data: CreateNutritionDaySchema) -> NutritionDay:
        day = NutritionDay(**data.model_dump())
        self.db.add(day)
        self.db.commit()
        self.db.refresh(day)
        return day

    def get_day(self, day_id: UUID) -> Optional[NutritionDay]:
        return self.db.query(NutritionDay).filter_by(id=day_id).first()

    def update_day(self, day_id: UUID, data: UpdateNutritionDaySchema) -> Optional[NutritionDay]:
        day = self.get_day(day_id)
        if not day:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(day, key, value)
        self.db.commit()
        self.db.refresh(day)
        return day