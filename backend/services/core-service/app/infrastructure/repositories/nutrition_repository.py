from typing import Annotated, Optional, List
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.schemas.nutrition_schema import UpdateNutritionDaySchema
from app.domain.models.nutrition_model import NutritionWeek, NutritionDay
from uuid import UUID
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

    def update_week_title(self, week_id: UUID, new_title: str):
        self.db.query(NutritionWeek).filter_by(id=week_id).update({"title": new_title})
        self.db.commit()


    def create_day(self, day: NutritionDay) -> NutritionDay:
        self.db.add(day)
        self.db.commit()
        self.db.refresh(day)
        return day

    def get_day(self, day_id: UUID) -> Optional[NutritionDay]:
        return self.db.query(NutritionDay).filter_by(id=day_id).first()

    def update_day(self, day_id: UUID, data: UpdateNutritionDaySchema) -> NutritionDay:
        day = self.get_day(day_id)
        if not day:
            raise HTTPException(status_code=404, detail="Day not found")

        for field, value in data.dict(exclude_unset=True).items():
            setattr(day, field, value)

        self.db.commit()
        self.db.refresh(day)
        return day    


    def get_days_by_week_id(self, week_id: UUID) -> List[NutritionDay]:
        return self.db.query(NutritionDay).filter_by(week_id=week_id).order_by(NutritionDay.created_at).all()
