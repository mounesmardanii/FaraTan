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


    def get_all_sessions(self) -> List[PlanSession]:
        return self.db.query(PlanSession).all()

    def get_by_id(self, session_id: UUID) -> Optional[PlanSession]:
        return self.db.query(PlanSession).filter_by(id=session_id).first()
