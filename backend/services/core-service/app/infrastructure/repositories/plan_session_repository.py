from sqlalchemy.orm import Session
from typing import List, Optional, Annotated
from uuid import UUID
from app.domain.models.plan_session_model import PlanSession
from app.core.postgres_db.database import get_db
from fastapi import Depends


class PlanSessionRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create(self, session: PlanSession) -> PlanSession:
      self.db.add(session)
      self.db.commit()
      self.db.refresh(session)
      return session


    def get_sessions_by_plan_id(self, plan_id: UUID) -> List[PlanSession]:
        return self.db.query(PlanSession).filter(PlanSession.plan_id == plan_id).all()

    def get_by_id(self, session_id: UUID) -> Optional[PlanSession]:
        return self.db.query(PlanSession).filter_by(id=session_id).first()
    
    def update(self, session_id: UUID, fields: dict) -> PlanSession:
        self.db.query(PlanSession).filter(PlanSession.id == session_id).update(fields)
        self.db.commit()
        return self.get_by_id(session_id)

    def delete(self, session: PlanSession) -> bool:
        self.db.delete(session)
        self.db.commit()
        return True
    
    def get_sessions_by_trainer_id(self, trainer_id: UUID) -> List[PlanSession]:
        return self.db.query(PlanSession).filter_by(trainer_id=trainer_id).all()
