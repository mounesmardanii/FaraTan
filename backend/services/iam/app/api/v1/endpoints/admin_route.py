from fastapi import Depends, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from loguru import logger
from app.domain.schemas.admin_schema import( AdminLoginSchema, SendOTPResponseSchema,
                                            SendOTPSchema,ForgetPasswordSchema,
                                            ResetPasswordSchema, VerifyOTPSchema,VerifyOTPResponseSchema   )
from app.domain.schemas.token_schema import TokenSchema
from app.services.auth_services.auth_service import AuthService
from app.services.admin_main_service import AdminMainervice
from app.services.admin_service import AdminService



admin_router = APIRouter()


@admin_router.post("/login", response_model=TokenSchema, status_code=status.HTTP_200_OK)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: Annotated[AuthService, Depends()],
) -> TokenSchema:

    logger.info(f"Logging in admin with phone_number {form_data.username}")
    return await auth_service.authenticate_admin(
        AdminLoginSchema(phone_number=form_data.username, password=form_data.password)
    )    

@admin_router.post(
    "/SendOTP",
    response_model=SendOTPResponseSchema,
    status_code=status.HTTP_200_OK,
)
async def send_otp(
    data: SendOTPSchema,
    admin_service: Annotated[AdminMainervice, Depends()],
) -> SendOTPResponseSchema:
    logger.info(f"Sending OTP for admin with phone_number {data.phone_number}")
    return await admin_service.send_otp(data)


@admin_router.post(
    "/VerifyOTPForgetPassword", status_code=status.HTTP_200_OK
)
async def verify_otp_for_password(
    data: VerifyOTPSchema,
    admin_service: Annotated[AdminMainervice, Depends()],
) :
    logger.info(f"Verifying OTP for admin with phone_number {data.phone_number}")
    return await admin_service.verify_otp_forget_password(data)

@admin_router.put(
    "/ForgetPassword",
    status_code=status.HTTP_200_OK)
async def forget_password(
        admin_data: ForgetPasswordSchema,
        admin_service: Annotated[AdminService, Depends()]
):
    logger.info(f'🔃 Changing password for admin {admin_data.phone_number}')
    return await admin_service.change_admin_password(admin_data.phone_number, dict(admin_data)) 