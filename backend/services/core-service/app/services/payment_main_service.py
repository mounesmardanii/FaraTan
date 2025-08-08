from app.services.payment_service import PaymentService
from app.services.plan_session_service import PlanSessionService
from loguru import logger
from fastapi import  Depends, HTTPException
from typing import Annotated
from uuid import UUID
from app.services.plan_purchase_service import PlanPurchaseService


class PaymentMainService:
    def __init__(self,
        payment_service: Annotated[PaymentService, Depends()],
        session_service: Annotated[PlanSessionService, Depends()],
        purchase_service: Annotated[PlanPurchaseService, Depends()],

        ):
        self.payment_service = payment_service 
        self.session_service = session_service 
        self.purchase_service = purchase_service 

    async def initiate_payment(self, member_id: UUID, session_id:UUID) -> str:
        logger.info(f"Initiating payment for member: {member_id}")
        session = await self.session_service.get_by_id(session_id)
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        if session.capacity == 0:
            raise HTTPException(status_code=403, detail="No Capacity")

        purchase = await self.purchase_service.create_session_purchase(member_id, session_id, session.price)

        payment_url = await self.payment_service.request_payment(purchase.id, amount = session.price)
        return payment_url

    async def confirm_payment(self, purchase_id: UUID, authority: str, status: str) -> bool:
        purchase = await self.purchase_service.get_purchase_by_id(purchase_id)
        if status != "OK":
            await self.purchase_service.update_status(purchase_id, "Canceled")
            return "Canceled"

        is_successful = await self.payment_service.verify_payment(
            amount=purchase.amount,  
            authority=authority 
        )

        if is_successful:
            await self.purchase_service.update_status(purchase_id, "Paid")
            await self.session_service.reduce_capacity(purchase.session_id)
            return "success"
        else:
            await self.purchase_service.update_status(purchase_id, "Canceled")
            return "failed"
        