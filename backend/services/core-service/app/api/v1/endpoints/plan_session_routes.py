from fastapi import APIRouter, Depends, status
from typing import List, Annotated
from uuid import UUID
from app.services.plan_session_main_service import PlanSessionMainService
from app.domain.schemas.plan_session_schema import PlanSessionCreateSchema, PlanSessionResponseSchema
from app.services.auth_services.auth_service import get_current_admin 
from app.domain.schemas.token_schema import TokenDataSchema

plan_session_router = APIRouter()

@plan_session_router.post("/create-session", response_model=PlanSessionResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_plan_session(data: PlanSessionCreateSchema,
service: Annotated[PlanSessionMainService, Depends()],
current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)]
):
    return await service.create_session(data)

