from typing import List, Annotated
from fastapi import Depends
from app.domain.schemas.stats_schema import MemberGrowthStatSchema
from app.services.stats_service import StatService

class StatMainService:
    def __init__(self, service: Annotated[StatService, Depends()]):
        self.service = service

    def get_member_growth_stats(self) -> List[MemberGrowthStatSchema]:
        data = self.service.get_growth_stats()
        return [MemberGrowthStatSchema(month=row.month, member_count=row.member_count) for row in data]
