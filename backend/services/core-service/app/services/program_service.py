from app.domain.models.program_model import ProgramMovement
from app.infrastructure.repositories.program_repository import ProgramMovementRepository
from typing import Annotated, List
from loguru import logger
from fastapi import Depends, HTTPException, status
from datetime import date
from uuid import UUID
from app.domain.schemas.program_schema import CreateProgramMovementSchema, ProgramMovementResponseSchema

class ProgramMovementService:
    def __init__(self, repo: Annotated[ProgramMovementRepository, Depends()]):
        self.repo = repo

    async def add_movement(self, data: CreateProgramMovementSchema) -> ProgramMovement:
        movement = ProgramMovement(
            member_id=data.member_id,
            movement_id=data.movement_id,
            sets=data.sets,
            reps=data.reps,
            weight=data.weight,
            duration=data.duration,
        )
        return self.repo.add_movement(movement)

    async def delete_movement(self, member_id: UUID, movement_id: UUID):
        return self.repo.delete_movement(member_id, movement_id)

    async def get_program(self, member_id: UUID):
        return self.repo.get_member_program(member_id)