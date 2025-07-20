from fastapi import APIRouter, Depends, status
from typing import List, Annotated
from uuid import UUID

from app.services.schedule_main_service import GymScheduleMainService
from app.domain.schemas.schedule_schema import (
    GymScheduleCreateSchema,
    GymScheduleUpdateSchema,
    GymScheduleResponseSchema,
)

gym_schedule_router = APIRouter()

@gym_schedule_router.post("/", response_model=GymScheduleResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_gym_schedule(
    data: GymScheduleCreateSchema,
    service: Annotated[GymScheduleMainService, Depends()]
):
    return await service.create_schedule(data)

@gym_schedule_router.get("/{schedule_id}", response_model=GymScheduleResponseSchema)
async def get_schedule_by_id(
    schedule_id: UUID,
    service: Annotated[GymScheduleMainService, Depends()]
):
    return await service.get_schedule_by_id(schedule_id)
