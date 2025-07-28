from sqlalchemy.orm import Session
from typing import List, Optional, Annotated
from uuid import UUID
from app.domain.models.reservation_model import Reservation
from app.domain.models.schedule_model import GymSchedule, PlanSession
from app.core.postgres_db.database import get_db
from fastapi import Depends
from datetime import date 
from loguru import logger


class ReservationRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create(self, reservation: Reservation) -> Reservation:
        self.db.add(reservation)
        self.db.commit()
        self.db.refresh(reservation)
        return reservation

    def get_by_member_id(self, member_id: UUID) -> List[Reservation]:
        return self.db.query(Reservation).filter_by(member_id=member_id).all()
    

    def get_by_id(self, id: UUID) -> Reservation:
        return self.db.query(Reservation).filter_by(id=id).first()
    

    def already_reserved(self, member_id: UUID, session_schedule_id: UUID) -> bool:
        return (
            self.db.query(Reservation)
            .filter_by(
                member_id=member_id,
                session_schedule_id=session_schedule_id,
                status="Reserved"
            )
            .first()
            is not None
        )

    def can_reserve_more_sessions(self, member_id: UUID, session_id: UUID) -> bool:
        current_count = (
            self.db.query(Reservation)
            .filter_by(
                member_id=member_id,
                session_id=session_id,
                status="Reserved"
            )
            .count()
        )
        session = self.db.query(PlanSession).filter_by(id=session_id).first()
        
        if current_count < session.session_count:
            return True
        else:
            return False


    def get_by_id_and_member(self, reservation_id: UUID, member_id: UUID) -> Reservation | None:
        return (
            self.db.query(Reservation)
            .filter_by(id=reservation_id, member_id=member_id)
            .first()
        )

    def cancel_reservation(self, reservation: Reservation) -> None:
        reservation.status = "Canceled"
        self.db.commit()


