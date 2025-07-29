from fastapi import Depends
from typing import Annotated
from app.services.plan_service import PlanService

class PlanMainService:
    def __init__(
        self,
        plan_service: Annotated[PlanService, Depends()],
    ):
        self.service = plan_service

    def get_all_plans(self):
        return self.service.get_all_plans()

    def get_plan_by_id(self, plan_id):
        return self.service.get_plan_by_id(plan_id)
