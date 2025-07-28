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
        return self.repo.create_movement(movement)

    async def get_movement_by_id(self, movement_id: str) -> Movement:
        movement = self.repo.get_movement_by_id(movement_id)
        if not movement:
            raise HTTPException(status_code=404, detail="Movement not found")
        return movement

    async def get_all_movements(self) -> List[Movement]:
      return self.repo.get_all_movements()
    
    async def update_movement_title(self, movement_id: UUID, title: str) -> Movement:
        return self.repo.update_movement_title(movement_id, title)

    async def delete_movement(self, movement_id: str) -> None:
        return self.repo.delete_movement(movement_id)