from sqlalchemy.orm import Session
from typing import List, Optional
from typing import Annotated, List
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.postgres_database import get_db
from app.domain.models.movements_model import Movement
from uuid import UUID
from sqlalchemy import func

class MovementRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db


    def get_movement_by_id(self, movement_id: UUID) -> Optional[Movement]:
        return self.db.query(Movement).filter(Movement.id == movement_id).first()

    def update_movement_fields(self, movement_id: UUID, fields: dict) -> None:
        self.db.query(Movement).filter_by(id=movement_id).update(fields)
        self.db.commit()

