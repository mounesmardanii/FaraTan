from typing import List, Optional, Annotated
from uuid import UUID
from fastapi import Depends
from app.infrastructure.repositories.plan_session_repository import PlanSessionRepository
from app.domain.schemas.plan_session_schema import PlanSessionCreateSchema
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

    async def get_all_sessions(self) -> List[PlanSession]:
        return self.repo.get_all_sessions()

