from uuid import UUID
from fastapi import Depends, HTTPException
from app.domain.schemas.reservation_schema import ReservationResponseSchema
from app.services.reservation_service import ReservationService
from app.services.plan_session_service import PlanSessionService
from app.services.plan_purchase_service import PlanPurchaseService
from typing import List, Annotated
from datetime import date 
from app.services.schedule_service import GymScheduleService

class ReservationMainService:
    def __init__(
        self,
        reservation_service: Annotated[ReservationService, Depends()],
        session_service:  Annotated[PlanSessionService, Depends()],
        purchase_service: Annotated[PlanPurchaseService, Depends()],
        schedule_service: Annotated[GymScheduleService, Depends()],

    ):
        self.reservation_service = reservation_service
        self.session_service = session_service
        self.purchase_service = purchase_service
        self.schedule_service = schedule_service

    async def reserve_session(self, member_id: UUID, session_schedule_id: UUID) -> ReservationResponseSchema:

        schedule = await self.schedule_service.get_by_id(session_schedule_id)
        session = await self.session_service.get_by_id(schedule.session_id)
        if not session or not session.is_active:
            raise HTTPException(status_code=404, detail="Session not found or inactive")

        if session.capacity <= 0:
            raise HTTPException(status_code=403, detail="No capacity")

        purchased_plans = await self.purchase_service.get_purchased_plans_by_member(member_id)

        flag = 0
        for p_id in purchased_plans:
            if p_id == session.plan_id:
                flag = 1
                break
            

        if flag == 0:
            raise HTTPException(status_code=403, detail="Unauthorized to reserve this session")

        target_date = schedule.weekday
        print(target_date) 
        if await self.reservation_service.already_reserved(member_id, session_schedule_id):
            raise HTTPException(status_code=400, detail="Already reserved")
        can = await self.reservation_service.can_reserve_more_sessions(member_id, session.id)
        if not can:
            raise HTTPException(status_code=400, detail="You reached to the max session_count.")

        await self.session_service.reduce_capacity(session.id)

        created = await self.reservation_service.create(member_id, session.id, session_schedule_id)
        return ReservationResponseSchema.from_orm(created)


    async def get_my_reservations(self, member_id: UUID) -> List[ReservationResponseSchema]:
        reservations = await self.reservation_service.get_by_member_id(member_id)
        return [ReservationResponseSchema.from_orm(r) for r in reservations]
