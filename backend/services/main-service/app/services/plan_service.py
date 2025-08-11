from app.infrastructure.repositories.plan_repository import PlanRepository
from app.domain.models.plan_model import Plan
from typing import List, Optional, Annotated
from uuid import UUID
from fastapi import Depends


class PlanService:
    def __init__(self, repo: Annotated[PlanRepository, Depends()]):
        self.repo = repo

    async def get_all_plans(self) -> List[Plan]:
        return self.repo.get_all()

    async def get_plan_by_id(self, plan_id: UUID) -> Optional[Plan]:
        return self.repo.get_by_id(plan_id)
    
    async def create_plan(self, data) -> Plan:
        return self.repo.create(data)
    
    async def update(self, plan_id , updated_data) -> Plan:
        return self.repo.update(plan_id, updated_data)