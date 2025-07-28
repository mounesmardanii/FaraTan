from app.domain.schemas.movements_schema import CreateMovementSchema, MovementResponseSchema
from typing import Annotated, List
from loguru import logger
from fastapi import Depends, HTTPException
from uuid import UUID
from app.services.movement_service import MovementService

class MovementMainService:
    def __init__(self, service: Annotated[MovementService, Depends()]):
        self.service = service

    async def create_movement(self, data: CreateMovementSchema) -> MovementResponseSchema:
        movements = await self.service.get_all_movements()
        for m in movements:
            if m.title == data.title:
                raise HTTPException(status_code=403, detail="Movement already exists.")

        return await self.service.create_movement(data)

    async def get_movement_by_id(self, movement_id: str) -> MovementResponseSchema:
        return await self.service.get_movement_by_id(movement_id)

    async def get_all_movements(self) -> List[MovementResponseSchema]:
        return await self.service.get_all_movements()
