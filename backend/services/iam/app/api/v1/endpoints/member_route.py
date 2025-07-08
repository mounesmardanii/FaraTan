from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from loguru import logger
from  app.domain.schemas.member_schema import MemberCreateSchema, MemberResponseSchema, MemberLoginSchema
from  app.domain.schemas.token_schema import TokenSchema, TokenDataSchema
from  app.services.auth_services.auth_service import AuthService
from app.services.member_main_service import MemberMainService
from app.services.member_service import MemberService
# from  app.services.auth_services.auth_service import get_current_member

member_router = APIRouter()

@member_router.post(
    "/Register",
    response_model=MemberResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    member: MemberCreateSchema, register_service: Annotated[MemberMainService, Depends()]
) -> MemberResponseSchema:
    logger.info(f"Registering member with phone_number:{member.phone_number}")
    return await register_service.register_member(member)



@member_router.post("/login", response_model=TokenSchema, status_code=status.HTTP_200_OK)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: Annotated[AuthService, Depends()],
) -> TokenSchema:

    logger.info(f"Logging in member with phone_number {form_data.username}")
    return await auth_service.authenticate_member(
        MemberLoginSchema(phone_number=form_data.username, password=form_data.password)
    )    

