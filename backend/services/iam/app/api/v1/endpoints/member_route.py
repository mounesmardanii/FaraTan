from fastapi import Depends, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from loguru import logger
from app.domain.schemas.member_schema import(
MemberCreateSchema,
MemberResponseSchema,
UpdateMemberInfoSchema,
MemberLoginSchema,
ForgetPasswordSchema,
ResendOTPResponseSchema,
ResendOTPSchema,
MemberProfileUpdateSchema,
VerifyOTPResponseSchema,
VerifyOTPSchema,
MemberProfileResponseSchema,
MemberProfileCreateSchema,
BodyMeasurementCreateSchema,
BodyMeasurementResponseSchema,
BodyMeasurementUpdateSchema
)
from app.domain.schemas.token_schema import TokenSchema, TokenDataSchema
from app.services.auth_services.auth_service import AuthService
from app.services.member_main_service import MemberMainService
from app.services.member_service import MemberService
from app.services.auth_services.auth_service import get_current_member

member_router = APIRouter()

@member_router.post("/register", response_model=MemberResponseSchema, status_code=status.HTTP_201_CREATED)
async def register(
    member: MemberCreateSchema,
    member_service: Annotated[MemberMainService, Depends()]
) -> MemberResponseSchema:
    logger.info(f"📝 Registering member with phone_number: {member.phone_number}")
    return await member_service.register_member(member)


@member_router.post("/login", response_model=TokenSchema, status_code=status.HTTP_200_OK)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: Annotated[AuthService, Depends()]
) -> TokenSchema:
    logger.info(f"🔐 Login attempt for member: {form_data.username}")
    return await auth_service.authenticate_member(
        MemberLoginSchema(phone_number=form_data.username, password=form_data.password)
    )


@member_router.post("/send-otp", response_model=ResendOTPResponseSchema, status_code=status.HTTP_200_OK)
async def resend_otp(
    resend_otp_schema: ResendOTPSchema,
    member_service: Annotated[MemberMainService, Depends()]
) -> ResendOTPResponseSchema:
    logger.info(f"📨 Resending OTP to: {resend_otp_schema.phone_number}")
    return await member_service.resend_otp(resend_otp_schema)


@member_router.post("/verify-otp", response_model=VerifyOTPResponseSchema, status_code=status.HTTP_200_OK)
async def verify_otp(
    data: VerifyOTPSchema,
    member_service: Annotated[MemberMainService, Depends()]
) -> VerifyOTPResponseSchema:
    logger.info(f"🔍 Verifying OTP for: {data.phone_number}")
    return await member_service.verify_member(data)


@member_router.put("/forget-password", status_code=status.HTTP_200_OK)
async def forget_password(
    member_data: ForgetPasswordSchema,
    member_service: Annotated[MemberService, Depends()]
):
    logger.info(f"🔑 Changing password for member: {member_data.phone_number}")
    return await member_service.change_member_password(member_data.phone_number, dict(member_data))


@member_router.get("/me", response_model=MemberResponseSchema)
async def get_my_info(
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    member_service: Annotated[MemberService, Depends()]
) -> MemberResponseSchema:
    logger.info(f"📄 Getting profile for member ID: {current_member.member_id}")
    return await member_service.get_member_by_id(current_member.member_id)


@member_router.put("/update-info", response_model=MemberResponseSchema)
async def update_info(
    data: UpdateMemberInfoSchema,
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    member_service: Annotated[MemberService, Depends()]
) -> MemberResponseSchema:
    logger.info(f"✏️ Updating info for member ID: {current_member.member_id}")
    return await member_service.update_member(current_member.member_id, data)


@member_router.post("/profile", response_model=MemberProfileResponseSchema)
async def create_profile(
    profile_data: MemberProfileCreateSchema,
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    member_service: Annotated[MemberService, Depends()]
) -> MemberProfileResponseSchema:
    logger.info(f"🆕 Creating profile for member ID: {current_member.member_id}")
    return await member_service.create_profile(current_member.member_id, profile_data)


@member_router.put("/profile", response_model=MemberProfileResponseSchema)
async def update_profile(
    profile_data: MemberProfileUpdateSchema,
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    member_service: Annotated[MemberService, Depends()]
) -> MemberProfileResponseSchema:
    logger.info(f"🧾 Updating profile for member ID: {current_member.member_id}")
    return await member_service.update_profile(current_member.member_id, profile_data)


@member_router.post("/body-measurements", response_model=BodyMeasurementResponseSchema)
async def create_body_measurement(
    data: BodyMeasurementCreateSchema,
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    member_service: Annotated[MemberService, Depends()]
) -> BodyMeasurementResponseSchema:
    logger.info(f"📏 Creating body measurement for member ID: {current_member.member_id}")
    return await member_service.create_body_measurement(current_member.member_id, data)


@member_router.put("/body-measurements", response_model=BodyMeasurementResponseSchema)
async def update_body_measurement(
    data: BodyMeasurementUpdateSchema,
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    member_service: Annotated[MemberService, Depends()]
) -> BodyMeasurementResponseSchema:
    logger.info(f"📐 Updating body measurement for member ID: {current_member.member_id}")
    return await member_service.update_body_measurement(current_member.member_id, data)


@member_router.get("/body-measurements", response_model=BodyMeasurementResponseSchema)
async def get_body_measurements(
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    member_service: Annotated[MemberService, Depends()]
) -> BodyMeasurementResponseSchema:
    logger.info(f"📊 Retrieving body measurements for member ID: {current_member.member_id}")
    return await member_service.get_member_body_measurements(current_member.member_id)