from app.domain.models.trainer_model import Trainer
from app.infrastructure.repositories.trainer_repository import TrainerRepository
from typing import Annotated, Dict, Optional
from loguru import logger
from fastapi import Depends, HTTPException, status
from datetime import date

class TrainerService:
    def __init__(self, trainer_repository: Annotated[TrainerRepository, Depends()]):
        self.trainer_repository = trainer_repository

  