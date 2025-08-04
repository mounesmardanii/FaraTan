
from fastapi import Depends, status, APIRouter
from typing import Annotated, List
from loguru import logger
from app.domain.schemas.movements_schema import MovementResponseSchema, CreateMovementSchema
from uuid import UUID
from app.services.movement_main_service import MovementMainService
movement_router = APIRouter()

@movement_router.post("/movements", status_code=status.HTTP_201_CREATED, response_model=MovementResponseSchema)
async def create_movement(
    data: CreateMovementSchema,
    service: Annotated[MovementMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)]
):
    return await service.create_movement(data)

@movement_router.get("/movements/{movement_id}", status_code=status.HTTP_200_OK, response_model=MovementResponseSchema)
async def get_movement_by_id(
    movement_id: str,
    service: Annotated[MovementMainService, Depends()],
):
    return await service.get_movement_by_id(movement_id)

@movement_router.get("/movements", status_code=status.HTTP_200_OK, response_model=List[MovementResponseSchema])
async def get_all_movements(
    service: Annotated[MovementMainService, Depends()],
    #   current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)]
):
    
    return await service.get_all_movements()


@movement_router.put("/movements/{movement_id}/title", status_code=status.HTTP_200_OK)
async def update_movement_title(
    movement_id: UUID,
    new_title: str,
    service: Annotated[MovementMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)]
):
    return await service.update_movement_title(movement_id, new_title)


@movement_router.delete("/movements/{movement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_movement(
    movement_id: str,
    service: Annotated[MovementMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)]
):
    return await service.delete_movement(movement_id)
