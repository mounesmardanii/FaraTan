from typing import Annotated, List
from loguru import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.models.sports_model import GymSports
from uuid import UUID


class SportsRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
      self.db = db

    def get_all_sports(self) -> List[GymSports]:
        return self.db.query(GymSports).all()