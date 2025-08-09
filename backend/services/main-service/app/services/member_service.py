from typing import Annotated, Dict, List
from loguru import logger
from fastapi import Depends, HTTPException, status
from  app.domain.models.member_model import Member
from  app.domain.schemas.member_schema import MemberCreateSchema, UpdateMemberInfoSchema, MemberResponseSchema
from  app.infrastructure.repositories.member_repository import MemberRepository
from  app.services.base_service import BaseService
from uuid import UUID
from datetime import date


class MemberService(BaseService):
    def __init__(
        self,
        member_repository: Annotated[MemberRepository, Depends()],
    ) -> None:
        super().__init__()
        self.member_repository = member_repository

    async def create_member(self, member_body: MemberCreateSchema) -> Member:
        logger.info(f"⚒️ Creating member with phone_number: {member_body.phone_number}")
        member = Member(
        full_name=member_body.full_name,
        phone_number=member_body.phone_number,
        birthdate = member_body.birthdate,
        health_conditions = member_body.health_conditions,
        fitness_goals = member_body.fitness_goals
        )
        return self.member_repository.create_member(member)


    async def get_member_by_number(self, phone_number: str) -> Member:
        logger.info(f"📥 Fetching member with phone_number {phone_number}")
        return self.member_repository.get_member_by_number(phone_number)

    async def get_member_by_id(self, member_id: UUID) -> Member:  
        logger.info(f"📥 Fetching member with id {member_id}")
        return self.member_repository.get_member_by_id(member_id)
    
    async def get_all_members(self) -> List[Member]:  
        return self.member_repository.get_all_members()
    
    async def update_verified_status(self, member_id: UUID, update_fields: Dict) -> Member: 
        logger.info(f"🔃 Updating member with id {member_id}")
        return self.member_repository.update_member(member_id, update_fields)

    async def update_member(self, member_id: UUID, update_fields: UpdateMemberInfoSchema) -> Member:
        update_fields = update_fields.model_dump(exclude_unset=True)
        logger.info(f"🔃 Updating member with id {member_id}")
        
        update_fields = {key: value for key, value in update_fields.items() if value != ""}  

        updated = self.member_repository.update_member(member_id, update_fields) 
        return MemberResponseSchema.from_orm(updated) 

    async def delete_member(self, member_id:UUID):
        return self.member_repository.delete_member_by_id(member_id)