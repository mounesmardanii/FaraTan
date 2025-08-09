from fastapi import Depends, status, APIRouter
from typing import Annotated, List
from loguru import logger
from app.domain.schemas.member_schema import(
MemberCreateSchema,
MemberResponseSchema,
UpdateMemberInfoSchema,
)
from app.services.member_service import MemberService
from app.services.member_main_service import MemberMainService
from uuid import UUID
member_router = APIRouter()

@member_router.post(
    "/register",
    response_model=MemberResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    member: MemberCreateSchema, member_service: Annotated[MemberMainService, Depends()]
) -> MemberResponseSchema:
    logger.info(f"🔐 Registering member: {member.phone_number}")
    return await member_service.register_member(member)



@member_router.delete("/members/{member_id}", status_code=status.HTTP_200_OK)
async def delete_member(
    member_id: UUID,
    member_service: Annotated[MemberMainService, Depends()],
):
    await member_service.delete_member(member_id)
    return {"message": f"✅ Member deleted successfully"}


@member_router.put("/update-info/{member_id}", status_code=status.HTTP_200_OK)
async def update_info(
    member_id: UUID,
    member_data: UpdateMemberInfoSchema,
    member_service: Annotated[MemberService, Depends()]
)-> MemberResponseSchema:
    logger.info(f"✏️ Updating info for member ID: {member_id}")
    return await member_service.update_member(member_id, member_data)

@member_router.get("/", response_model=List[MemberResponseSchema])
async def get_all_members(
    service: Annotated[MemberService, Depends()],
):
    return await service.get_all_members()