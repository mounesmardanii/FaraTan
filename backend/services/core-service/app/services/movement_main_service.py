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
        # movements = await self.service.get_all_movements()
        # for m in movements:
        #     if m.title == data.title:
        #         raise HTTPException(status_code=403, detail="Movement already exists.")

        await self.service.create_movement(data)
        return MovementResponseSchema.from_orm(movement)


    async def get_movement_by_id(self, movement_id: str) -> MovementResponseSchema:
        movement = await self.service.get_movement_by_id(movement_id)
        return MovementResponseSchema.from_orm(movement)

    async def get_all_movements(self) -> List[MovementResponseSchema]:
        movements = await self.service.get_all_movements()
        return [MovementResponseSchema.from_orm(movement) for movement in movements]

    async def update_movement_title(self, movement_id: UUID, title: str) -> MovementResponseSchema:
        movement = await self.service.get_movement_by_id(movement_id)
        if not movement:
            raise HTTPException(status_code=404, detail="Movement not found")
        new = await self.service.update_movement_title(movement_id, title)
        return MovementResponseSchema.from_orm(new)

    async def delete_movement(self, movement_id: str) -> None:
        movement = await self.service.get_movement_by_id(movement_id)
        if not movement:
            raise HTTPException(status_code=404, detail="Movement not found")
        return await self.service.delete_movement(movement_id)