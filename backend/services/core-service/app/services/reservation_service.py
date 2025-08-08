from typing import List, Annotated
from uuid import UUID
from fastapi import Depends
from app.infrastructure.repositories.reservation_repository import ReservationRepository
from app.domain.models.reservation_model import Reservation
from datetime import date


class ReservationService:
    def __init__(self, repo: Annotated[ReservationRepository, Depends()]):
        self.repo = repo

    async def create(self, member_id:UUID, session_id:UUID, session_schedule_id:UUID) -> Reservation:
        reservation = Reservation(
            member_id=member_id,
            session_id=session_id,
            session_schedule_id=session_schedule_id,
        )
        return self.repo.create(reservation)

    async def get_by_member_id(self, member_id: UUID) -> List[Reservation]:
        return self.repo.get_by_member_id(member_id)

    async def already_reserved(self, member_id: UUID, session_schedule_id: UUID) -> bool:
        return self.repo.already_reserved(member_id, session_schedule_id)
    

    async def can_reserve_more_sessions(self, member_id: UUID, session_schedule_id: UUID) -> bool:
        return self.repo.can_reserve_more_sessions(member_id, session_schedule_id)


    async def get_by_id_and_member(self, reservation_id: UUID, member_id: UUID) -> Reservation | None:
        return self.repo.get_by_id_and_member(reservation_id, member_id)


    async def cancel(self, reservation: Reservation) -> None:
        self.repo.cancel_reservation(reservation)


    async def get_last_reservation_by_member_id(self, member_id: UUID) -> List[Reservation]:
        return self.repo.get_last_reservation_by_member_id(member_id)
