from fastapi import Depends, status, APIRouter
from typing import Annotated
from loguru import logger
from  app.domain.schemas.member_schema import MemberCreateSchema, MemberResponseSchema
from app.services.member_main_service import MemberMainService

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

