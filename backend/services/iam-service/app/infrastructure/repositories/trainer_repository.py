from typing import Annotated, Optional
from loguru import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.models.trainer_model import Trainer
from uuid import UUID



class TrainerRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
      self.db = db

    def get_trainer_by_phone_number(self, phone_number: str) -> Optional[Trainer]:
        return self.db.query(Trainer).filter_by(phone_number=phone_number).first()

    def create_trainer(self, trainer: Trainer) -> Trainer:
        self.db.add(trainer)
        self.db.commit()
        self.db.refresh(trainer)
        logger.info(f"✅ Trainer [{trainer.phone_number}] created")
        return trainer

    def get_all_trainers(self):
        return self.db.query(Trainer).all()
    
    def get_trainer_by_id(self, trainer_id: int):
        return self.db.query(Trainer).filter(Trainer.id == trainer_id).first()
    
    def delete_trainer(self, trainer: Trainer):
        self.db.delete(trainer)
        self.db.commit()


    def update_trainer_by_id(self, trainer_id: int, update_fields: dict):
        trainer_query = self.db.query(Trainer).filter(Trainer.id == trainer_id)
        trainer_db = trainer_query.first()

        if trainer_db:
            trainer_query.update(update_fields, synchronize_session=False)
            self.db.commit()
            self.db.refresh(trainer_db)
            logger.info(f"✅ Trainer {trainer_id} updated with fields: {update_fields}")
            return trainer_db
        else:
            logger.warning(f"⚠️ Trainer {trainer_id} not found")
            return None
    