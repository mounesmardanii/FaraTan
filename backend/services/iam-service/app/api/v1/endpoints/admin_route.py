from fastapi import Depends, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated, List
from loguru import logger
from app.domain.schemas.admin_schema import(
SendOTPResponseSchema,
SendOTPSchema,
ForgetPasswordSchema,
VerifyOTPSchema,
AdminResponseSchema,
)

from app.services.trainer_service import TrainerService
from app.domain.schemas.trainer_schema import TrainerCreateSchema, TrainerResponseSchema, TrainerUpdateSchema
from app.domain.schemas.token_schema import TokenSchema
from app.services.auth_services.auth_service import AuthService
from app.services.admin_main_service import AdminMainService
from app.services.admin_service import AdminService
from uuid import UUID
from app.services.auth_services.auth_service import get_current_admin
from app.services.member_main_service import MemberMainService
from app.domain.schemas.token_schema import TokenSchema, TokenDataSchema

admin_router = APIRouter()


# @admin_router.post("/login", response_model=TokenSchema, status_code=status.HTTP_200_OK)
# async def login_for_access_token(
#     form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
#     auth_service: Annotated[AuthService, Depends()],
# ) -> TokenSchema:
#     logger.info(f"🔐 Admin login attempt: {form_data.username}")
#     return await auth_service.authenticate_admin(
#         AdminLoginSchema(phone_number=form_data.username, password=form_data.password)
#     )

@admin_router.get("/Me", response_model=AdminResponseSchema, status_code=status.HTTP_200_OK)
async def read_me(current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)],
) -> AdminResponseSchema:
    logger.info(f"📥 Getting admin with phone_number {current_admin.phone_number}")
    return current_admin

@admin_router.post("/send-otp", response_model=SendOTPResponseSchema, status_code=status.HTTP_200_OK)
async def send_otp(
    data: SendOTPSchema,
    admin_service: Annotated[AdminMainService, Depends()],
) -> SendOTPResponseSchema:
    logger.info(f"📨 Sending OTP to admin: {data.phone_number}")
    return await admin_service.send_otp(data)


@admin_router.post("/verify-otp-forget-password", status_code=status.HTTP_200_OK)
async def verify_otp_for_password(
    data: VerifyOTPSchema,
    admin_service: Annotated[AdminMainService, Depends()],
):
    logger.info(f"🔍 Verifying OTP for admin: {data.phone_number}")
    return await admin_service.verify_otp_forget_password(data)


@admin_router.put("/forget-password", status_code=status.HTTP_200_OK)
async def forget_password(
    admin_data: ForgetPasswordSchema,
    admin_service: Annotated[AdminService, Depends()],
):
    logger.info(f"🔃 Changing password for admin: {admin_data.phone_number}")
    return await admin_service.change_admin_password(admin_data.phone_number, dict(admin_data))


@admin_router.delete("/members/{member_id}", status_code=status.HTTP_200_OK)
async def delete_member(
    member_id: UUID,
    member_service: Annotated[MemberMainService, Depends()],
):
    logger.info(f"🗑️ Admin requested to delete member ID: {member_id}")
    await member_service.delete_member(member_id)
    return {"message": f"✅ Member deleted successfully"}



@admin_router.post("/trainers/register", status_code=status.HTTP_201_CREATED, response_model=TrainerResponseSchema)
async def register_trainer(
    trainer_data: TrainerCreateSchema,
    trainer_service: Annotated[TrainerService, Depends()],
    current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)]
) -> TrainerResponseSchema:
    logger.info(f"👤 Admin [{current_admin.admin_id}] registering trainer: {trainer_data.phone_number}")
    return await trainer_service.create_trainer(trainer_data)


@admin_router.get("/", response_model=List[TrainerResponseSchema])
async def get_all_trainers(
    trainer_service: Annotated[TrainerService, Depends()],
):
    return await trainer_service.get_all_trainers()


@admin_router.get("/{trainer_id}", response_model=TrainerResponseSchema)
async def get_trainer_by_id(
    trainer_id: UUID,
    trainer_service: Annotated[TrainerService, Depends()],
):
    return await trainer_service.get_trainer_by_id(trainer_id)


@admin_router.delete("/{trainer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trainer(
    trainer_id: UUID,
    trainer_service: Annotated[TrainerService, Depends()],
):
    await trainer_service.delete_trainer(trainer_id)
    return {"message": f"✅ Trainer deleted successfully"}




@admin_router.put("/{trainer_id}", response_model=TrainerResponseSchema)
async def update_trainer(
    trainer_id: UUID,
    update_data: TrainerUpdateSchema,
    trainer_service: Annotated[TrainerService, Depends()],
):
    return await trainer_service.update_trainer(trainer_id, update_data)
