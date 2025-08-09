from typing import List, Annotated
from fastapi import Depends
from app.domain.schemas.stats_schema import MemberGrowthStatSchema
from app.services.member_service import MemberService
from app.services.plan_purchase_service import PlanPurchaseService

class StatMainService:
    def __init__(self,
       member_service: Annotated[MemberService, Depends()],
       purchase_service: Annotated[PlanPurchaseService, Depends()],

       ):
        self.member_service = member_service
        self.purchase_service = purchase_service

    async def get_member_growth_stats(self) -> List[MemberGrowthStatSchema]:
        return await self.member_service.get_growth_stats()
    

    async def get_revenue_this_month(self):
        return await self.purchase_service.get_revenue_this_month()    
    
    async def get_active_members_count(self):
        return await self.purchase_service.get_active_members_count()    
    
