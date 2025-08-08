# from fastapi import Depends, status, APIRouter
# from typing import Annotated, List, Dict
# from loguru import logger
# from app.domain.schemas.token_schema import MemberTokenDataSchema

# member_router = APIRouter()

# @member_router.get("/body-measurements/weight-trend", response_model=List[Dict])
# async def get_weight_trend(
#     service: Annotated[MemberMainService, Depends()],
#     current_member: Annotated[MemberTokenDataSchema, Depends(get_current_member)],
# ):
#     return await service.get_weight_trend(current_member.id)