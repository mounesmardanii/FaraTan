from fastapi import HTTPException
from app.domain.models.movements_model import Movement
from app.infrastructure.repositories.movement_repository import MovementRepository
from typing import Annotated, List, Optional
from loguru import logger
from fastapi import Depends, HTTPException
from uuid import UUID

class MovementService:
    def __init__(self, repo: Annotated[MovementRepository, Depends()]):
        self.repo = repo

    async def get_movement_by_id(self, movement_id: str) -> Movement:
        movement = self.repo.get_movement_by_id(movement_id)
        if not movement:
            raise HTTPException(status_code=404, detail="Movement not found")
        return movement
    
    async def update_movement_video(self, movement_id: UUID, mongo_id: Optional[str], is_vip: Optional[bool]):
        movement = self.repo.get_movement_by_id(movement_id)
        if not movement:
            raise HTTPException(status_code=404, detail="Movement not found")

        update_fields = {}
        if mongo_id:
            update_fields["video_url"] = mongo_id
        if is_vip is not None:
            update_fields["is_vip"] = is_vip

        if update_fields:
            self.repo.update_movement_fields(movement_id, update_fields)
