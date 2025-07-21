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
    

  #   def create_sport(self, sport: GymSports) -> GymSports:
  #     self.db.add(sport)
  #     self.db.commit()
  #     self.db.refresh(sport)
  #     return sport

  # def get_sport_by_id(self, sport_id: UUID) -> Optional[GymSports]:
  #     return self.db.query(GymSports).filter_by(id=sport_id).first()
