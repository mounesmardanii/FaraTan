from typing import Annotated, Dict, Optional, List
from loguru import logger
from fastapi import Depends, HTTPException, status
from app.domain.models.member_model import Member, MemberProfile, BodyMeasurement

from app.infrastructure.repositories.member_repository import MemberRepository
from app.services.auth_services.hash_service import HashService
from app.services.base_service import BaseService
from uuid import UUID


class MemberService(BaseService):
    def __init__(
        self,
        member_repository: Annotated[MemberRepository, Depends()],
        hash_service: Annotated[HashService, Depends()],
    ) -> None:
        super().__init__()
        self.member_repository = member_repository
        self.hash_service = hash_service


    async def get_member_by_number(self, phone_number: str) -> Member:
        logger.info(f"📥 Fetching member with phone_number {phone_number}")
        return self.member_repository.get_member_by_number(phone_number)

    async def get_member_by_id(self, member_id: UUID) -> Member:  
        logger.info(f"📥 Fetching member with id {member_id}")
        return self.member_repository.get_member_by_id(member_id)

    async def get_profile_by_member_id(self, member_id: UUID) -> MemberProfile:
        return self.member_repository.get_profile_by_member_id(member_id)

    async def get_growth_stats(self):
        return self.member_repository.get_member_growth_last_three_months()
    
    async def get_monthly_weight_trend(self, member_id: UUID) -> List[Dict]:
        return self.member_repository.get_monthly_weight_trend(member_id)