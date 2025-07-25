from typing import List, Annotated
from fastapi import Depends
from app.domain.schemas.stats_schema import MemberGrowthStatSchema
from app.services.member_service import MemberService
from app.services.schedule_service import GymScheduleService

class StatMainService:
    def __init__(self,
       member_service: Annotated[MemberService, Depends()],
       schedule_service: Annotated[GymScheduleService, Depends()],

       ):
        self.member_service = member_service
        self.schedule_service = schedule_service

    async def get_member_growth_stats(self) -> List[MemberGrowthStatSchema]:
        data = await self.member_service.get_growth_stats()
        return [MemberGrowthStatSchema(month=row.month, member_count=row.member_count) for row in data]
    
    async def get_weekly_schedule(self):
        return await self.schedule_service.get_weekly_schedule()