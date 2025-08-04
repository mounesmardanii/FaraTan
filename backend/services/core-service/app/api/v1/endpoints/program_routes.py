from fastapi import APIRouter, Depends, status
from typing import List, Annotated
from uuid import UUID
from app.domain.schemas.program_schema import CreateProgramMovementSchema, ProgramMovementResponseSchema 
from app.services.program_main_service import ProgramMovementMainService


program_router = APIRouter()

@program_router.post("/program-movements", status_code=status.HTTP_201_CREATED, response_model=ProgramMovementResponseSchema)
async def add_movement_to_program(
    data: CreateProgramMovementSchema,
    service: Annotated[ProgramMovementMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)],
):
    return await service.add_movement(data)

@program_router.delete("/program-movements/{movement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_movement_from_program(
    movement_id: UUID,
    member_id: UUID,
    service: Annotated[ProgramMovementMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)],
):
    return await service.delete_movement(member_id, movement_id)

@program_router.get("/member-program/{member_id}", response_model=List[ProgramMovementResponseSchema])
async def get_member_program(
    service: Annotated[ProgramMovementMainService, Depends()],
    # current_member: Annotated[MemberTokenDataSchema, Depends(get_current_member)],
    member_id:UUID,
):
    return await service.get_program(member_id)

@program_router.get("/program/{member_id}", response_model=List[ProgramMovementResponseSchema])
async def get_member_program(
    member_id: UUID,
    service: Annotated[ProgramMovementMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)],
):
    return await service.get_program(member_id)