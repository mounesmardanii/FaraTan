from typing import Annotated, Dict, Optional
from loguru import logger
from fastapi import Depends, HTTPException, status
from  app.domain.models.member_model import Member, MemberProfile, BodyMeasurement
from  app.domain.schemas.member_schema import MemberUpdateSchema
from  app.infrastructure.repositories.member_repository import MemberRepository
from  app.services.base_service import BaseService
from uuid import UUID
from datetime import date
from app.domain.schemas.member_schema import MemberUpdateSchema


class MemberService(BaseService):
    def __init__(
        self,
        member_repository: Annotated[MemberRepository, Depends()],
    ) -> None:
        super().__init__()
        self.member_repository = member_repository

    async def get_member_by_id(self, member_id: UUID) -> Member:  
        logger.info(f"📥 Fetching member with id {member_id}")
        return self.member_repository.get_member_by_id(member_id)



    async def update_member(self, member_id: UUID, update_fields: MemberUpdateSchema) -> Member:
        update_fields = update_fields.model_dump(exclude_unset=True)
        logger.info(f"🔃 Updating member with id {member_id}")
               
        update_fields = {key: value for key, value in update_fields.items() if value != ""}  

        return self.member_repository.update_member(member_id, update_fields)  

 