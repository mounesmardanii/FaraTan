from app.domain.models.trainer_model import Trainer
from app.domain.schemas.trainer_schema import  TrainerUpdateSchema, TrainerResponseSchema
from app.infrastructure.repositories.trainer_repository import TrainerRepository
from typing import Annotated, Dict, Optional
from loguru import logger
from fastapi import Depends, HTTPException, status
from datetime import date

class TrainerService:
    def __init__(self, trainer_repository: Annotated[TrainerRepository, Depends()]):
        self.trainer_repository = trainer_repository

    
    async def get_trainer_by_id(self, trainer_id: int) -> TrainerResponseSchema:
        trainer = self.trainer_repository.get_trainer_by_id(trainer_id)
        if not trainer:
            raise HTTPException(status_code=404, detail="Trainer not found")
        return TrainerResponseSchema.from_orm(trainer)


    async def update_trainer(self, trainer_id: int, update_data: TrainerUpdateSchema) -> TrainerResponseSchema:
        trainer = self.trainer_repository.get_trainer_by_id(trainer_id)
        if not trainer:
            raise HTTPException(status_code=404, detail="Trainer not found")

        update_data = {
            key: value
            for key, value in update_data.model_dump(exclude_unset=True).items()
            if value != ""
        }

        updated = self.trainer_repository.update_trainer(trainer_id,update_data)
        return TrainerResponseSchema.from_orm(updated)    