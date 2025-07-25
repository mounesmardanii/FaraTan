from fastapi import APIRouter, Depends, status
from typing import List, Annotated
from uuid import UUID

from app.services.reservaion_main_service import ReservationMainService
from app.domain.schemas.reservation_schema import ReservationResponseSchema
from app.services.auth_services.member_auth_service import get_current_member
from app.domain.schemas.token_schema import TokenDataSchema

reservation_router = APIRouter()


@reservation_router.post("/create-reservation", response_model=ReservationResponseSchema)
async def create_reservation(
    session_schedule_id:UUID,
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    service: Annotated[ReservationMainService, Depends()],
):
    return await service.reserve_session(current_member.id, session_schedule_id)


@reservation_router.get("/my-reservations", response_model=List[ReservationResponseSchema])
async def get_my_reservations(
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    service: Annotated[ReservationMainService, Depends()],
):
    return await service.get_my_reservations(current_member.id)


@reservation_router.post("/cancel/{reservation_id}")
async def cancel_reservation(
    reservation_id: UUID,
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    service: Annotated[ReservationMainService, Depends()],
):
    await service.cancel_reservation(reservation_id, current_member.id)
    return {"detail": "Reserve canceled successfully"}
