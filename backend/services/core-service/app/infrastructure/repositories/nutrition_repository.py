from typing import Annotated, Optional, List
from loguru import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.models.nutrition_model import NutritionWeek
from uuid import UUID

class NutritionRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create_week(self, week: NutritionWeek) -> NutritionWeek:
        self.db.add(week)
        self.db.commit()
        self.db.refresh(week)
        return week


