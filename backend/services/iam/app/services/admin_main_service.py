from typing import Annotated, Dict
from loguru import logger
from  app.domain.models.admin_model import Admin
from  app.services.base_service import BaseService
from uuid import UUID
from app.services.admin_service import AdminService
from app.services.auth_services.auth_service import AuthService
from fastapi import Depends, HTTPException, status
from app.domain.schemas.admin_schema import SendOTPResponseSchema,SendOTPSchema, VerifyOTPResponseSchema, VerifyOTPSchema
from app.services.auth_services.otp_service import OTPService


class AdminMainervice(BaseService):
    def __init__(
        self,
        admin_service: Annotated[AdminService, Depends()],
        auth_service: Annotated[AuthService, Depends()],
        otp_service: Annotated[OTPService, Depends()],

    ) -> None:
        super().__init__()
        self.admin_service = admin_service
        self.otp_service = otp_service
        self.auth_service = auth_service

    async def send_otp(
        self, data: SendOTPSchema
    ) -> SendOTPResponseSchema:
        existing_admin = await self.admin_service.get_admin_by_phone_number(data.phone_number)
        if not existing_admin:
            logger.error(f"admin with phone_number {data.phone_number} does not exist")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="admin does not exist")

        if self.otp_service.check_exist(data.phone_number):
            logger.error(f"OTP for phone_number {data.phone_number} already exists")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP already exists")

        if self.config.ENABLE_OTP:
            otp = self.otp_service.send_otp(data.phone_number)

            logger.info(f"OTP resent to phone_number {data.phone_number}")
            return SendOTPResponseSchema(
                phone_number=data.phone_number,
                message="OTP sent to phone_number",
            )   
        else:
            logger.info("OTP service is disabled, skipping OTP sending")
            return SendOTPResponseSchema(
                phone_number=data.phone_number,
                message="OTP feature is disabled",
            )

    async def verify_otp_forget_password(
        self, verify_admin_schema: VerifyOTPSchema
    ) :
        if not self.otp_service.verify_otp(
            verify_admin_schema.phone_number, verify_admin_schema.otp
        ):
            logger.error(f"Invalid OTP for phone_number {verify_admin_schema.phone_number}❌")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP❌"
            )

        admin = await self.admin_service.get_admin_by_phone_number(verify_admin_schema.phone_number)
        await self.admin_service.update_verified_status(admin.admin_id, {"can_reset_password": True})

        logger.info(f"admin with phone_number{verify_admin_schema.phone_number} Requested for password reseting")
        return {"status_code": 200, "message": "OTP Verified Successfully"}
