from sqlalchemy.orm import Session
from typing import List, Optional
from typing import Annotated, List
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.models.movements_model import Movement
from uuid import UUID
from sqlalchemy import func

class MovementRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create_movement(self, movement: Movement) -> Movement:
        self.db.add(movement)
        self.db.commit()
        self.db.refresh(movement)
        return movement

    def get_movement_by_id(self, movement_id: UUID) -> Optional[Movement]:
        return self.db.query(Movement).filter(Movement.id == movement_id).first()

    def get_all_movements(self) -> List[Movement]:
        return self.db.query(Movement).all()

    def update_movement_title(self, movement_id: UUID, new_title: str) -> Movement:
        movement = self.db.query(Movement).filter_by(id=movement_id).update({"title": new_title})
        self.db.commit()
        updated = self.db.query(Movement).filter_by(id=movement_id).first()
        return updated
    
    def delete_movement(self, movement_id: str) -> None:
            movement = self.db.query(Movement).filter(Movement.id == movement_id).first()
            self.db.delete(movement)
            self.db.commit()