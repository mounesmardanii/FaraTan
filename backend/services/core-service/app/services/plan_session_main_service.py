from fastapi import Depends
from typing import List, Optional, Annotated
from uuid import UUID
from app.services.plan_session_service import PlanSessionService
from app.domain.schemas.plan_session_schema import PlanSessionCreateSchema, PlanSessionResponseSchema


class PlanSessionMainService:
    def __init__(self, service: Annotated[PlanSessionService, Depends()]):
        self.service = service

    async def create_session(self, data: PlanSessionCreateSchema) -> PlanSessionResponseSchema:
        session = await self.service.create(data)
        return PlanSessionResponseSchema.from_orm(session)


    async def get_all_sessions(self) -> List[PlanSessionResponseSchema]:
        sessions = await self.service.get_all_sessions()
        return [PlanSessionResponseSchema.from_orm(p) for p in sessions]

