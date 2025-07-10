from typing import Annotated, Dict
from loguru import logger
from fastapi import Depends, HTTPException
from  app.domain.models.member_model import Member, MemberProfile
from  app.domain.schemas.member_schema import MemberCreateSchema, MemberResponseSchema, MemberProfileCreateSchema
from  app.infrastructure.repositories.member_repository import MemberRepository
from  app.services.auth_services.hash_service import HashService
from  app.services.base_service import BaseService
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

    async def create_member(self, member_body: MemberCreateSchema) -> Member:
        logger.info(f"⚒️ Creating member with phone_number: {member_body.phone_number}")
        member = Member(
        full_name=member_body.full_name,
        phone_number=member_body.phone_number,
        password=self.hash_service.hash_password(member_body.password),
        national_id=member_body.national_id
        )
        return self.member_repository.create_member(member)


    async def get_member_by_number(self, phone_number: str) -> Member:
        logger.info(f"📥 Fetching member with phone_number {phone_number}")
        return self.member_repository.get_member_by_number(phone_number)

    async def get_member_by_id(self, member_id: UUID) -> Member:  
        logger.info(f"📥 Fetching member with id {member_id}")
        return self.member_repository.get_member_by_id(member_id)

    async def update_verified_status(self, member_id: UUID, update_fields: Dict) -> Member: 
        logger.info(f"🔃 Updating member with id {member_id}")
        return self.member_repository.update_member(member_id, update_fields)

    async def update_member(self, member_id: UUID, update_fields: Dict) -> Member:
        logger.info(f"🔃 Updating member with id {member_id}")
        if "password" in update_fields:
            password = update_fields.get("password")
            confirm_password = update_fields.pop("confirm_password", None)
            if password != confirm_password:
                raise HTTPException(status_code=400, detail="Passwords do not match")

            update_fields['password'] = self.hash_service.hash_password(update_fields['password'])
        
        update_fields = {key: value for key, value in update_fields.items() if value != ""}  

        return self.member_repository.update_member(member_id, update_fields)  

    async def update_can_change_status(self, member_id: UUID, update_fields: Dict) -> Member: 
        logger.info(f"🔃 Updating member with id {member_id}")
        return self.member_repository.update_member(member_id, update_fields)

    async def change_member_password(self, phone_number:str, update_fields: Dict) -> MemberResponseSchema:
        logger.info(f"🔃 Changing password member with id {phone_number}")
        password = update_fields.get("password")
        confirm_password = update_fields.pop("confirm_password", None)
        if password != confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")

        update_fields['password'] = self.hash_service.hash_password(update_fields['password'])

        member = self.member_repository.get_member_by_number(phone_number)
        if self.config.ENABLE_OTP and member.can_reset_password != True:
            raise HTTPException(status_code=400, detail='You need to verify the otp first')

        self.member_repository.update_member(member.id, {"can_reset_password": False})    
        updated_member = self.member_repository.update_member(member.id, update_fields)
        return MemberResponseSchema.from_orm(updated_member)
    

    
    async def get_profile_by_member_id(self, member_id: UUID) -> MemberProfile:
        return self.member_repository.get_profile_by_member_id(member_id)

    async def create_profile(self, member_id: UUID, profile_data: MemberProfileCreateSchema) -> MemberProfile:
        if profile_data.gender not in ["male","female"]:
            raise HTTPException(status_code=400, detail='Invalid gender')
        profile = MemberProfile(
            member_id=member_id,
            height=profile_data.height,
            gender=profile_data.gender,
            birthdate=profile_data.birthdate,
            health_conditions=profile_data.health_conditions,
            fitness_goals=profile_data.fitness_goals,
        )
        return self.member_repository.create_profile(profile)
