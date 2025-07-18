from fastapi import Depends, HTTPException
from typing import List, Optional, Annotated
from uuid import UUID
from app.services.plan_session_service import PlanSessionService
from app.domain.schemas.plan_session_schema import PlanSessionCreateSchema, PlanSessionResponseSchema, PlanSessionUpdateSchema


class PlanSessionMainService:
    def __init__(self, service: Annotated[PlanSessionService, Depends()]):
        self.service = service

    async def create_session(self, data: PlanSessionCreateSchema) -> PlanSessionResponseSchema:
        session = await self.service.create(data)
        return PlanSessionResponseSchema.from_orm(session)


    async def get_sessions_by_plan_id(self, plan_id:UUID) -> List[PlanSessionResponseSchema]:
        sessions = await self.service.get_sessions_by_plan_id(plan_id)
        return [PlanSessionResponseSchema.from_orm(p) for p in sessions]

    async def get_session_by_id(self, session_id: UUID) -> Optional[PlanSessionResponseSchema]:
        session = await self.service.get_by_id(session_id)
        return PlanSessionResponseSchema.from_orm(session)
    
    async def update_session(self, session_id: UUID, update_data: PlanSessionUpdateSchema) -> PlanSessionResponseSchema:
        session = await self.service.get_by_id(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        if "price" in update_fields and update_fields["price"] < 0:
            raise HTTPException(status_code=400, detail="Price cannot be negative")

        update_fields = update_data.model_dump(exclude_unset=True)

        updated = self.service.update_session(session_id, update_fields)
        return PlanSessionResponseSchema.from_orm(updated)