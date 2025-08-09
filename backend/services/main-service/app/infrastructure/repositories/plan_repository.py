from app.domain.models.plan_model import Plan
from typing import List, Optional, Annotated
from uuid import UUID
from app.core.postgres_db.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session

class PlanRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def get_all(self) -> List[Plan]:
        return self.db.query(Plan).all()

    def get_by_id(self, plan_id: UUID) -> Optional[Plan]:
        return self.db.query(Plan).filter(Plan.id == plan_id).first()