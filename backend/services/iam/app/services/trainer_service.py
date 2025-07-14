from app.domain.models.trainer_model import Trainer
from app.domain.schemas.trainer_schema import TrainerCreateSchema, TrainerResponseSchema, TrainerUpdateSchema
from app.infrastructure.repositories.trainer_repository import TrainerRepository
from typing import Annotated, Dict, Optional
from loguru import logger
from fastapi import Depends, HTTPException, status
from datetime import date

class TrainerService:
    def __init__(self, trainer_repository: Annotated[TrainerRepository, Depends()]):
        self.trainer_repository = trainer_repository

    async def create_trainer(self, data: TrainerCreateSchema) -> TrainerResponseSchema:
        existing = self.trainer_repository.get_trainer_by_phone_number(data.phone_number)
        if existing:
            raise HTTPException(status_code=400, detail="Trainer already exists")
        trainer = Trainer(
          first_name = data.first_name,
          last_name = data.last_name,
          phone_number = data.phone_number,
          specialty = data.specialty,
          birth_date = data.birth_date,
          start_date = data.start_date,
          age = self._calculate_years_between(data.birth_date),
          years_of_experience = self._calculate_years_between(data.start_date),
        )
        new_trainer = self.trainer_repository.create_trainer(trainer)
        return TrainerResponseSchema.from_orm(new_trainer)

    def _calculate_years_between(self,start: date) -> int:
      today = date.today()
      return today.year - start.year - ((today.month, today.day) < (start.month, start.day))

    async def get_all_trainers(self) -> list[TrainerResponseSchema]:
        trainers = self.trainer_repository.get_all_trainers()
        return [TrainerResponseSchema.from_orm(t) for t in trainers]
    

    async def get_trainer_by_id(self, trainer_id: int) -> TrainerResponseSchema:
        trainer = self.trainer_repository.get_trainer_by_id(trainer_id)
        if not trainer:
            raise HTTPException(status_code=404, detail="Trainer not found")
        return TrainerResponseSchema.from_orm(trainer)
    

    async def get_trainer_by_id(self, trainer_id: int) -> TrainerResponseSchema:
        trainer = self.trainer_repository.get_trainer_by_id(trainer_id)
        if not trainer:
            raise HTTPException(status_code=404, detail="Trainer not found")
        return TrainerResponseSchema.from_orm(trainer)
    
    async def delete_trainer(self, trainer_id: int) -> None:
        trainer = self.trainer_repository.get_trainer_by_id(trainer_id)
        if not trainer:
            raise HTTPException(status_code=404, detail="Trainer not found")
        self.trainer_repository.delete_trainer(trainer)


    async def update_trainer(self, trainer_id: int, update_data: TrainerUpdateSchema) -> TrainerResponseSchema:
        trainer = self.trainer_repository.get_trainer_by_id(trainer_id)
        if not trainer:
            raise HTTPException(status_code=404, detail="Trainer not found")

        for field, value in update_data.dict(exclude_unset=True).items():
            setattr(trainer, field, value)

        if update_data.birth_date:
            trainer.age = self._calculate_years_between(update_data.birth_date)
        if update_data.start_date:
            trainer.years_of_experience = self._calculate_years_between(update_data.start_date)

        updated = self.trainer_repository.update_trainer(trainer)
        return TrainerResponseSchema.from_orm(updated)    