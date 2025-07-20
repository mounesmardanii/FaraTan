from fastapi import APIRouter, Depends, status
from typing import List, Annotated
from uuid import UUID

from app.services.schedule_main_service import GymScheduleMainService
from app.domain.schemas.schedule_schema import (
    GymScheduleCreateSchema,
    GymScheduleUpdateSchema,
    GymScheduleResponseSchema,
)
from app.services.auth_services.auth_service import get_current_admin
from app.domain.schemas.token_schema import TokenDataSchema

gym_schedule_router = APIRouter()

@gym_schedule_router.post("/create-schedule", response_model=GymScheduleResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_gym_schedule(
    data: GymScheduleCreateSchema,
    current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)],
    service: Annotated[GymScheduleMainService, Depends()]
):
    return await service.create_schedule(data)

@gym_schedule_router.get("/{schedule_id}", response_model=GymScheduleResponseSchema)
async def get_schedule_by_id(
    schedule_id: UUID,
    service: Annotated[GymScheduleMainService, Depends()]
):
    return await service.get_schedule_by_id(schedule_id)

@gym_schedule_router.get("/trainer/{trainer_id}", response_model=List[GymScheduleResponseSchema])
async def get_schedules_by_trainer(
    trainer_id: UUID,
    service: Annotated[GymScheduleMainService, Depends()]
):
    return await service.get_schedules_by_trainer(trainer_id)

