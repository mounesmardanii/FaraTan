from typing import List, Optional, Annotated
from uuid import UUID
from fastapi import Depends, HTTPException
from app.infrastructure.repositories.plan_session_repository import PlanSessionRepository
from app.domain.schemas.plan_session_schema import PlanSessionCreateSchema, PlanSessionUpdateSchema, PlanSessionResponseSchema
from app.domain.models.plan_session_model import PlanSession


class PlanSessionService:
    def __init__(self, repo: Annotated[PlanSessionRepository, Depends()]):
        self.repo = repo

    async def create(self, data: PlanSessionCreateSchema) -> PlanSession:
        session = PlanSession(
            plan_id=data.plan_id,
            trainer_id=data.trainer_id,
            capacity=data.capacity,
            session_count=data.session_count,
            price=data.price,
        )
        return self.repo.create(session)

    async def get_sessions_by_plan_id(self, plan_id:UUID) -> List[PlanSession]:
        return self.repo.get_sessions_by_plan_id(plan_id)

    async def get_by_id(self, session_id: UUID) -> Optional[PlanSession]:
        return self.repo.get_by_id(session_id)
    
    async def update_session(self, session_id: UUID, update_fields: dict) -> PlanSession:
        return self.repo.update(session_id, update_fields)

    async def reduce_capacity(self, session_id: UUID) -> PlanSession:
        session = await self.get_by_id(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        if session.capacity < 1:
            raise HTTPException(status_code=400, detail="Capacity is already zero")

        new_capacity = session.capacity - 1
        return self.repo.update(session_id, {"capacity": new_capacity})
    

    async def delete_session(self, session_id: UUID) -> bool:
        session = await self.get_by_id(session_id)
        if not session:
            return False
        
        return self.repo.delete(session)
    

    async def get_sessions_by_trainer_id(self, trainer_id: UUID) -> List[PlanSession]:
        return self.repo.get_sessions_by_trainer_id(trainer_id)
