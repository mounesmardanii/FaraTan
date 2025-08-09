from app.domain.models.plan_model import Plan
from typing import List, Optional, Annotated
from uuid import UUID
from app.core.postgres_db.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from app.domain.schemas.plan_schema import PlanCreateSchema

class PlanRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db
    def create(self, plan_create: PlanCreateSchema) -> Plan:
        new_plan = Plan(
            name=plan_create.name,
            session_count=plan_create.session_count,
            price=plan_create.price
        )
        self.db.add(new_plan)
        self.db.commit()
        self.db.refresh(new_plan)
        return new_plan
    
    def get_all(self) -> List[Plan]:
        return self.db.query(Plan).all()

    def get_by_id(self, plan_id: UUID) -> Optional[Plan]:
        return self.db.query(Plan).filter(Plan.id == plan_id).first()