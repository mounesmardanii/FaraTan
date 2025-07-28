from fastapi import HTTPException
from app.domain.models.movements_model import Movement
from app.infrastructure.repositories.movement_repository import MovementRepository
from typing import Annotated, List, Optional
from loguru import logger
from fastapi import Depends, HTTPException
from uuid import UUID
from app.domain.schemas.movements_schema import CreateMovementSchema
class MovementService:
    def __init__(self, repo: Annotated[MovementRepository, Depends()]):
        self.repo = repo

    async def create_movement(self, data: CreateMovementSchema) -> Movement:
        movement = Movement(
            title=data.title
        )
        return await self.repo.create_movement(movement)

    async def get_movement_by_id(self, movement_id: str) -> Movement:
        movement = await self.repo.get_movement_by_id(movement_id)
        if not movement:
            raise HTTPException(status_code=404, detail="Movement not found")
        return movement

    async def get_all_movements(self) -> List[Movement]:
      return await self.repo.get_all_movements()
