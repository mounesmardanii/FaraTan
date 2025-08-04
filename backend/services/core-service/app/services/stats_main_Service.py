from typing import List, Annotated
from fastapi import Depends
from app.domain.schemas.stats_schema import MemberGrowthStatSchema
from app.services.member_service import MemberService
from app.services.schedule_service import GymScheduleService
from app.services.plan_purchase_service import PlanPurchaseService
from app.services.plan_session_service import PlanSessionService

class StatMainService:
    def __init__(self,
       member_service: Annotated[MemberService, Depends()],
       schedule_service: Annotated[GymScheduleService, Depends()],
       purchase_service: Annotated[PlanPurchaseService, Depends()],
       session_service: Annotated[PlanSessionService, Depends()],

       ):
        self.member_service = member_service
        self.schedule_service = schedule_service
        self.purchase_service = purchase_service
        self.session_service = session_service

    async def get_member_growth_stats(self) -> List[MemberGrowthStatSchema]:
        data = await self.member_service.get_growth_stats()
        return [MemberGrowthStatSchema(month=row.month, member_count=row.member_count) for row in data]
    
    async def get_weekly_schedule(self):
        return await self.schedule_service.get_weekly_schedule()

    async def get_revenue_this_month(self):
        return await self.purchase_service.get_revenue_this_month()    
    
    async def get_active_members_count(self):
        return await self.purchase_service.get_active_members_count()    
    

    
    async def get_active_trainers_count(self):
        return await self.session_service.get_active_trainers_count()    