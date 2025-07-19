from fastapi import APIRouter, Depends, status
from typing import List, Annotated
from uuid import UUID
from app.services.plan_session_main_service import PlanSessionMainService
from app.domain.schemas.plan_session_schema import PlanSessionCreateSchema, PlanSessionResponseSchema, PlanSessionUpdateSchema
from app.services.auth_services.auth_service import get_current_admin 
from app.domain.schemas.token_schema import TokenDataSchema

plan_session_router = APIRouter()

@plan_session_router.post("/create-session", response_model=PlanSessionResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_plan_session(data: PlanSessionCreateSchema,
service: Annotated[PlanSessionMainService, Depends()],
current_admin: Annotated[TokenDataSchema, Depends(get_current_admin)]
):
    return await service.create_session(data)

@plan_session_router.get("/get-sessions/{plan_id}", response_model=List[PlanSessionResponseSchema])
async def get_all_sessions(plan_id: UUID, service: Annotated[PlanSessionMainService, Depends()]):
    return await service.get_sessions_by_plan_id(plan_id)

@plan_session_router.get("/get-session/{session_id}", response_model=PlanSessionResponseSchema)
async def get_session_by_id(session_id: UUID, service: Annotated[PlanSessionMainService, Depends()]):
    return await service.get_session_by_id(session_id)


@plan_session_router.put("/{session_id}", response_model=PlanSessionResponseSchema)
async def update_plan_session(
    session_id: UUID,
    data: PlanSessionUpdateSchema,
    service: Annotated[PlanSessionMainService, Depends()],
):
    updated = await service.update_session(session_id, data)
    return updated
