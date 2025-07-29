from sqlalchemy.orm import Session
from typing import List, Optional, Annotated
from uuid import UUID
from app.domain.models.plan_session_model import PlanSession
from app.core.postgres_db.database import get_db
from fastapi import Depends
from sqlalchemy import func


class PlanSessionRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create(self, session: PlanSession) -> PlanSession:
      self.db.add(session)
      self.db.commit()
      self.db.refresh(session)
      return session


    def get_sessions_by_plan_id(self, plan_id: UUID, active_only: bool = False) -> List[PlanSession]:
        query = self.db.query(PlanSession).filter(PlanSession.plan_id == plan_id)
        if active_only:
            query = query.filter(PlanSession.is_active == True)
        return query.all()


    def get_by_id(self, session_id: UUID, active_only: bool = False) -> Optional[PlanSession]:
        query = self.db.query(PlanSession).filter_by(id=session_id)
        if active_only:
            query = query.filter(PlanSession.is_active == True)
        return query.first()

    
    def update(self, session_id: UUID, fields: dict) -> PlanSession:
        self.db.query(PlanSession).filter(PlanSession.id == session_id).update(fields)
        self.db.commit()
        return self.get_by_id(session_id)

    def delete(self, session: PlanSession) -> bool:
        self.db.delete(session)
        self.db.commit()
        return True
    
    def get_sessions_by_trainer_id(self, trainer_id: UUID, active_only: bool = True) -> List[PlanSession]:
        query = self.db.query(PlanSession).filter(PlanSession.trainer_id == trainer_id)
        if active_only:
            query = query.filter(PlanSession.is_active == True)
        return query.all()

    def get_active_trainers_count(self):
        active_trainers_count = self.db.query(func.count(func.distinct(PlanSession.trainer_id))).filter(
            PlanSession.is_active == True
        ).scalar()

        return active_trainers_count if active_trainers_count is not None else 0
    

    def get_monthly_session_count(self, member_id: UUID) -> int:
        start = datetime.utcnow().replace(day=1)
        end = start + relativedelta(months=1)

        return (
            self.db.query(func.count())
            .select_from(ProgramMovement)
            .filter(
                ProgramMovement.member_id == member_id,
                ProgramMovement.created_at >= start,
                ProgramMovement.created_at < end
            ).scalar()
        )