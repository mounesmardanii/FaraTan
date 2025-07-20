from fastapi import Depends, HTTPException
from typing import List, Optional, Annotated
from uuid import UUID
from app.services.schedule_service import GymScheduleService
from app.domain.schemas.schedule_schema import GymScheduleCreateSchema, GymScheduleResponseSchema, GymScheduleUpdateSchema
from app.services.schedule_service import GymScheduleService




class GymScheduleMainService:
    def __init__(self, service: Annotated[GymScheduleService, Depends()]):
        self.service = service

    async def create_schedule(self, data: GymScheduleCreateSchema) -> GymScheduleResponseSchema:
        schedule = await self.service.create(data)
        return GymScheduleResponseSchema.from_orm(schedule)

    async def get_schedule_by_id(self, schedule_id: UUID) -> GymScheduleResponseSchema:
        schedule = await self.service.get_by_id(schedule_id)
        if not schedule:
            raise HTTPException(status_code=404, detail="Schedule not found")
        return GymScheduleResponseSchema.from_orm(schedule)

    async def get_schedules_by_trainer(self, trainer_id: UUID) -> List[GymScheduleResponseSchema]:
        schedules = await self.service.get_by_trainer(trainer_id)
        return [GymScheduleResponseSchema.from_orm(s) for s in schedules]

    async def update_schedule(self, schedule_id: UUID, data: GymScheduleUpdateSchema) -> GymScheduleResponseSchema:
        schedule = await self.service.get_by_id(schedule_id)
        if not schedule:
            raise HTTPException(status_code=404, detail="Schedule not found")
        update_fields = data.model_dump(exclude_unset=True)
        updated = await self.service.update(schedule_id, update_fields)
        return GymScheduleResponseSchema.from_orm(updated)
