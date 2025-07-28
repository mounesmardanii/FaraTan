from typing import Annotated, List, Dict
from loguru import logger
from fastapi import Depends, HTTPException, status
from app.services.base_service import BaseService
from app.services.member_service import MemberService
from uuid import UUID

class MemberMainService(BaseService):
    def __init__(
        self,
        service: Annotated[MemberService, Depends()],
    ) -> None:
        super().__init__()

        self.service = service

    async def get_weight_trend(self, member_id: UUID) -> List[Dict]:
        return await self.service.get_monthly_weight_trend(member_id)