from typing import Annotated
from loguru import logger
from fastapi import Depends, HTTPException, status
from app.domain.schemas.member_schema import (
MemberResponseSchema,MemberCreateSchema, VerifyOTPResponseSchema, VerifyOTPSchema,
ResendOTPResponseSchema,ResendOTPSchema,
MemberProfileResponseSchema, MemberProfileCreateSchema,
BodyMeasurementCreateSchema, BodyMeasurementResponseSchema

)
from app.services.auth_services.auth_service import AuthService
from app.services.auth_services.otp_service import OTPService
from app.services.base_service import BaseService
from app.services.member_service import MemberService
from uuid import UUID

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
        existing_phone_number = await self.member_service.get_member_by_number(member.phone_number)

        if existing_phone_number:
            logger.error(f"member with number {member.phone_number} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="member already exists"
            )


        new_member = await self.member_service.create_member(member)
        if self.config.ENABLE_OTP:
            self.otp_service.send_otp(new_member.phone_number)
        logger.info(f"member with number: {member.phone_number} created successfully")
        return MemberResponseSchema.from_orm(new_member)

    async def verify_member(
        self, verify_member_schema: VerifyOTPSchema
    ) -> VerifyOTPResponseSchema:
        if not self.otp_service.verify_otp(
            verify_member_schema.phone_number, verify_member_schema.otp
        ):
            logger.error(f"Invalid OTP for phone_number {verify_member_schema.phone_number}❌")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP❌"
            )

        member = await self.member_service.get_member_by_number(
            verify_member_schema.phone_number
        )

        await self.member_service.update_verified_status(member.id, {"is_verified": True})

        logger.info(f"member with phone_number{verify_member_schema.phone_number} verified✅")
        return VerifyOTPResponseSchema(
            verified=True, message="member Verified Successfully"
        )

    async def resend_otp(
        self, resend_otp_schema: ResendOTPSchema
    ) -> ResendOTPResponseSchema:
        existing_member = await self.member_service.get_member_by_number(
            resend_otp_schema.phone_number
        )
        if not existing_member:
            logger.error(f"member with phone_number {resend_otp_schema.phone_number} does not exist")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="member does not exist"
            )

        if existing_member.is_verified:
            logger.error(f"member with phone_number {resend_otp_schema.phone_number} already verified")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="member already verified"
            )

        if self.otp_service.check_exist(resend_otp_schema.phone_number):
            logger.error(f"OTP for phone_number {resend_otp_schema.phone_number} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="OTP already exists"
            )

        otp = self.otp_service.send_otp(resend_otp_schema.phone_number)

        logger.info(f"OTP resent to phone_number {resend_otp_schema.phone_number}")
        return ResendOTPResponseSchema(
            phone_number=resend_otp_schema.phone_number,
            OTP=otp,
            message="OTP sent to phone_number",
        )   

    async def verify_otp_forget_password(
        self, verify_member_schema: VerifyOTPSchema
    ) :
        if not self.otp_service.verify_otp(
            verify_member_schema.phone_number, verify_member_schema.otp
        ):
            logger.error(f"Invalid OTP for phone_number {verify_member_schema.phone_number}❌")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP❌"
            )

        member = await self.member_service.get_member_by_number(verify_member_schema.phone_number)
        await self.member_service.update_verified_status(member.id, {"can_reset_password": True})

        logger.info(f"member with phone_number{verify_member_schema.phone_number} Requested for password reseting")
        return {"status_code": 200, "message": "OTP Verified Successfully"}
    

    async def create_profile(self, member_id: UUID, profile_data: MemberProfileCreateSchema) -> MemberProfileResponseSchema:
        existing = await self.member_service.get_profile_by_member_id(member_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Profile already exists for this member",
            )
        
        profile = await self.member_service.create_profile(member_id, profile_data)
        return MemberProfileResponseSchema.from_orm(profile)
    
    
    async def get_profile_by_member_id(self, member_id: UUID) -> MemberProfileCreateSchema:
        profile = await self.member_service.get_profile_by_member_id(member_id)
        if not profile:
            raise HTTPException(
                status_code=404, detail="Profile not found"
            )
        return MemberProfileResponseSchema.from_orm(profile)


    async def create_body_measurement(
        self,
        member_id: UUID,
        measurement_data: BodyMeasurementCreateSchema
    ) -> BodyMeasurementResponseSchema:
        measurement = await self.member_service.create_body_measurement(member_id, measurement_data)
        return BodyMeasurementResponseSchema.from_orm(measurement)
