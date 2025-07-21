from typing import List
from uuid import UUID
from fastapi import Depends
from app.infrastructure.repositories.reservation_repository import ReservationRepository
from app.domain.models.reservation_model import Reservation

class ReservationService:
    def __init__(self, repo: ReservationRepository = Depends()):
        self.repo = repo

    def create(self, member_id:UUID, session_id:UUID) -> Reservation:
        reservation = Reservation(
            member_id=member_id,
            session_id=session_id,
        )
        return self.repo.create(reservation)

    def get_by_member_id(self, member_id: UUID) -> List[Reservation]:
        return self.repo.get_by_member_id(member_id)

    def already_reserved(self, member_id: UUID, session_id: UUID) -> bool:
        return self.repo.already_reserved(member_id, session_id)
    
