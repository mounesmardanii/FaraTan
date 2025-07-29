from fastapi import Depends, HTTPException
from typing import List, Optional, Annotated
from uuid import UUID
from app.domain.schemas.program_schema import CreateProgramMovementSchema, ProgramMovementResponseSchema 
from app.services.program_service import ProgramMovementService
from app.services.member_service import MemberService
from app.services.movement_service import MovementService

class ProgramMovementMainService:
    def __init__(self,
      service: Annotated[ProgramMovementService, Depends()],
      movement_service: Annotated[MovementService, Depends()],
      member_service: Annotated[MemberService, Depends()],

      ):
        self.service = service
        self.member_service = member_service
        self.movement_service = movement_service

    async def add_movement(self, data: CreateProgramMovementSchema) -> ProgramMovementResponseSchema:
        member = await self.member_service.get_member_by_id(data.member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        mov = await self.movement_service.get_movement_by_id(data.movement_id)
        if not mov:
            raise HTTPException(status_code=404, detail="Movement not found")
        movement = await self.service.add_movement(data)
        return ProgramMovementResponseSchema.from_orm(movement)

    async def delete_movement(self, member_id: UUID, movement_id: UUID):
        member = await self.member_service.get_member_by_id(member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        mov = await self.movement_service.get_movement_by_id(movement_id)
        if not mov:
            raise HTTPException(status_code=404, detail="Movement not found")
        await self.service.delete_movement(member_id, movement_id)
        return {"detail": "Movement removed from program"}

    async def get_program(self, member_id: UUID) -> List[ProgramMovementResponseSchema]:
        member = await self.member_service.get_member_by_id(member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        movements = await self.service.get_program(member_id)
        return [ProgramMovementResponseSchema.from_orm(mv) for mv in movements]