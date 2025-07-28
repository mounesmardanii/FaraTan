from sqlalchemy.orm import Session
from typing import List, Optional, Annotated
from uuid import UUID
from app.domain.models.program_model import ProgramMovement
from app.core.postgres_db.database import get_db
from fastapi import Depends
from datetime import date 
from loguru import logger


class ProgramMovementRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def add_movement(self, movement: ProgramMovement) -> ProgramMovement:
        self.db.add(movement)
        self.db.commit()
        self.db.refresh(movement)
        return movement

    def delete_movement(self, member_id: UUID, movement_id: UUID):
        movement = self.db.query(ProgramMovement).filter_by(member_id=member_id, movement_id=movement_id).first()
        self.db.delete(movement)
        self.db.commit()

    def get_member_program(self, member_id: UUID) -> List[ProgramMovement]:
        return self.db.query(ProgramMovement).filter_by(member_id=member_id).all()