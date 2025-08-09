from app.infrastructure.repositories.plan_repository import PlanRepository
from app.domain.models.plan_model import Plan
from typing import List, Optional, Annotated
from uuid import UUID
from fastapi import Depends


class PlanService:
    def __init__(self, repo: Annotated[PlanRepository, Depends()]):
        self.repo = repo

    def get_all_plans(self) -> List[Plan]:
        return self.repo.get_all()

    def get_plan_by_id(self, plan_id: UUID) -> Optional[Plan]:
        return self.repo.get_by_id(plan_id)