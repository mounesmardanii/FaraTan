from typing import Annotated
from loguru import logger
from fastapi import Depends, HTTPException, status
from app.domain.schemas.member_schema import (
MemberResponseSchema,MemberCreateSchema
)
from app.services.auth_services.auth_service import AuthService
from app.services.auth_services.otp_service import OTPService
from app.services.base_service import BaseService
from app.services.member_service import MemberService
from app.utils import helper

class MemberMainService(BaseService):
    def __init__(
        self,
        member_service: Annotated[MemberService, Depends()],
        otp_service: Annotated[OTPService, Depends()],
        auth_service: Annotated[AuthService, Depends()],
    ) -> None:
        super().__init__()

        self.member_service = member_service
        self.otp_service = otp_service
        self.auth_service = auth_service

    async def register_member(self, member: MemberCreateSchema) -> MemberResponseSchema:
        existing_number = await self.member_service.get_member_by_number(member.phone_number)

        if existing_number:
            logger.error(f"member with number {member.phone_number} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="member already exists"
            )


        new_member = await self.member_service.create_member(member)
        # otp = self.otp_service.send_otp(new_member.number)
        logger.info(f"member with number: {member.phone_number} created successfully")
        return MemberResponseSchema.from_orm(new_member)

    # async def verify_member(
    #     self, verify_member_schema: VerifyOTPSchema
    # ) -> VerifyOTPResponseSchema:
    #     if not self.otp_service.verify_otp(
    #         verify_member_schema.number, verify_member_schema.otp
    #     ):
    #         logger.error(f"Invalid OTP for number {verify_member_schema.number}❌")
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP❌"
    #         )

    #     member = await self.member_service.get_member_by_number(
    #         verify_member_schema.number
    #     )

    #     await self.member_service.update_verified_status(member.member_id, {"is_verified": True})

    #     logger.info(f"member with number{verify_member_schema.number} verified✅")
    #     return VerifyOTPResponseSchema(
    #         verified=True, message="member Verified Successfully"
    #     )

    # async def resend_otp(
    #     self, resend_otp_schema: ResendOTPSchema
    # ) -> ResendOTPResponseSchema:
    #     existing_member = await self.member_service.get_member_by_number(
    #         resend_otp_schema.number
    #     )
    #     if not existing_member:
    #         logger.error(f"member with number {resend_otp_schema.number} does not exist")
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST, detail="member does not exist"
    #         )

    #     # if existing_member.is_verified:
    #     #     logger.error(f"member with number {resend_otp_schema.number} already verified")
    #     #     raise HTTPException(
    #     #         status_code=status.HTTP_400_BAD_REQUEST, detail="member already verified"
    #     #     )

    #     if self.otp_service.check_exist(resend_otp_schema.number):
    #         logger.error(f"OTP for number {resend_otp_schema.number} already exists")
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST, detail="OTP already exists"
    #         )

    #     otp = self.otp_service.send_otp(resend_otp_schema.number)

    #     logger.info(f"OTP resent to number {resend_otp_schema.number}")
    #     return ResendOTPResponseSchema(
    #         number=resend_otp_schema.number,
    #         OTP=otp,
    #         message="OTP sent to number",
    #     )   

    # async def verify_otp_forget_password(
    #     self, verify_member_schema: VerifyOTPSchema
    # ) :
    #     if not self.otp_service.verify_otp(
    #         verify_member_schema.number, verify_member_schema.otp
    #     ):
    #         logger.error(f"Invalid OTP for number {verify_member_schema.number}❌")
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP❌"
    #         )

    #     member = await self.member_service.get_member_by_number(verify_member_schema.number)
    #     await self.member_service.update_verified_status(member.member_id, {"can_reset_password": True})

    #     logger.info(f"member with number{verify_member_schema.number} Requested for password reseting")
    #     return {"status_code": 200, "message": "OTP Verified Successfully"}
    