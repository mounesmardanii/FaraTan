from fastapi import Depends, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from loguru import logger
from app.domain.schemas.member_schema import( MemberCreateSchema, MemberResponseSchema,
                                             UpdateMemberInfoSchema, MemberLoginSchema,
                                               ForgetPasswordSchema,ResendOTPResponseSchema,
                                               ResendOTPSchema,MemberProfileUpdateSchema,
                                               VerifyOTPResponseSchema,VerifyOTPSchema,
                                                MemberProfileResponseSchema,MemberProfileCreateSchema )
from app.domain.schemas.token_schema import TokenSchema, TokenDataSchema
from app.services.auth_services.auth_service import AuthService
from app.services.member_main_service import MemberMainService
from app.services.member_service import MemberService
from  app.services.auth_services.auth_service import get_current_member

member_router = APIRouter()

@member_router.post(
    "/Register",
    response_model=MemberResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    member: MemberCreateSchema, member_service: Annotated[MemberMainService, Depends()]
) -> MemberResponseSchema:
    logger.info(f"Registering member with phone_number:{member.phone_number}")
    return await member_service.register_member(member)


@member_router.post(
    "/VerifyOTP", response_model=VerifyOTPResponseSchema, status_code=status.HTTP_200_OK
)
async def verify_otp(
    verify_member_schema: VerifyOTPSchema,
    member_service: Annotated[MemberMainService, Depends()],
) -> VerifyOTPResponseSchema:
    logger.info(f"Verifying OTP for member with phone_number {verify_member_schema.phone_number}")
    return await member_service.verify_member(verify_member_schema)


@member_router.post("/login", response_model=TokenSchema, status_code=status.HTTP_200_OK)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: Annotated[AuthService, Depends()],
) -> TokenSchema:

    logger.info(f"Logging in member with phone_number {form_data.username}")
    return await auth_service.authenticate_member(
        MemberLoginSchema(phone_number=form_data.username, password=form_data.password)
    )    

@member_router.post(
    "/ResendOTP",
    response_model=ResendOTPResponseSchema,
    status_code=status.HTTP_200_OK,
)
async def resend_otp(
    resend_otp_schema: ResendOTPSchema,
    member_service: Annotated[MemberMainService, Depends()],
) -> ResendOTPResponseSchema:
    logger.info(f"Resending OTP for member with phone_number {resend_otp_schema.phone_number}")
    return await member_service.resend_otp(resend_otp_schema)


@member_router.put(
    "/UpdateInfo",
    status_code=status.HTTP_200_OK)
async def update_info(
        current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
        member_data: UpdateMemberInfoSchema,
        member_service: Annotated[MemberService, Depends()]
):
    logger.info(f'🔃 Changing member info for member {current_member.id}')
    return await member_service.update_member(current_member.id, member_data)
   

@member_router.get("/Me", response_model=MemberResponseSchema, status_code=status.HTTP_200_OK)
async def read_me(current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
) -> MemberResponseSchema:
    logger.info(f"📥 Getting member with phone_number {current_member.phone_number}")
    return current_member


@member_router.post(
    "/VerifyOTPForgetPassword", status_code=status.HTTP_200_OK
)
async def verify_otp_for_password(
    verify_member_schema: VerifyOTPSchema,
    member_service: Annotated[MemberMainService, Depends()],
) :
    logger.info(f"Verifying OTP for member with phone_number {verify_member_schema.phone_number}")
    return await member_service.verify_otp_forget_password(verify_member_schema)

@member_router.put(
    "/ForgetPassword",
    status_code=status.HTTP_200_OK)
async def forget_password(
        member_data: ForgetPasswordSchema,
        member_service: Annotated[MemberService, Depends()]
):
    logger.info(f'🔃 Changing member password for member {member_data.phone_number}')
    return await member_service.change_member_password(member_data.phone_number, dict(member_data))   



@member_router.post(
    "/member/profile",
    response_model=MemberProfileResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def create_member_profile(
    profile_data: MemberProfileCreateSchema,
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    member_service: Annotated[MemberMainService, Depends()],
) -> MemberProfileResponseSchema:
    return await member_service.create_profile(current_member.id, profile_data)



@member_router.get("/member/profile", response_model=MemberProfileResponseSchema, status_code=status.HTTP_200_OK)
async def get_member_profile(current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
member_service: Annotated[MemberMainService, Depends()],
) -> MemberProfileResponseSchema:
    return await member_service.get_profile_by_member_id(current_member.id)


@member_router.put(
    "/member/profile",
    response_model=MemberProfileResponseSchema,
    status_code=status.HTTP_200_OK,
)
async def update_member_profile(
    profile_data: MemberProfileUpdateSchema,
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    member_service: Annotated[MemberService, Depends()],
) -> MemberProfileResponseSchema:
    return await member_service.update_profile(current_member.id, profile_data)