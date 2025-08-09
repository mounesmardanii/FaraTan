from typing import Annotated
from loguru import logger
from fastapi import Depends, HTTPException, status
from app.domain.schemas.member_schema import MemberResponseSchema,MemberCreateSchema

from app.services.base_service import BaseService
from app.services.member_service import MemberService
from uuid import UUID


class MemberMainService(BaseService):
    def __init__(
        self,
        member_service: Annotated[MemberService, Depends()],

    ) -> None:
        super().__init__()

        self.member_service = member_service


    async def register_member(self, member: MemberCreateSchema) -> MemberResponseSchema:
        existing_phone_number = await self.member_service.get_member_by_number(member.phone_number)

        if existing_phone_number:
            logger.error(f"member with number {member.phone_number} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="member already exists"
            )

        new_member = await self.member_service.create_member(member)
        logger.info(f"member with number: {member.phone_number} created successfully")
        return MemberResponseSchema.from_orm(new_member)

   

    async def delete_member(self, member_id: UUID) -> None:
        existing_member = await self.member_service.get_member_by_id(member_id)

        if not existing_member:
            logger.error(f"❌ Member with ID {member_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found"
            )

        await self.member_service.delete_member(member_id)
        logger.info(f"✅ Member with ID {member_id} deleted successfully")
