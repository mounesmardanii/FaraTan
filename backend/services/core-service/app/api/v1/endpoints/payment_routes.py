from typing import Annotated
from app.services.payment_main_service import PaymentMainService
from fastapi import APIRouter, Depends, Query
from uuid import UUID
from app.services.auth_services.member_auth_service import get_current_member
from app.domain.schemas.token_schema import TokenDataSchema
from loguru import logger

payment_router = APIRouter()

@payment_router.post("/payment-request")
async def request_payment(
    session_id: UUID,
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    payment_main_service: Annotated[PaymentMainService, Depends()] ,
):
    logger.info(f"member {current_member.id} is starting to pay...")
    payment_url = await payment_main_service.initiate_payment(current_member.id, session_id)
    return {"payment_url": payment_url}


@payment_router.get("/callback/{purchase_id}")
async def payment_callback(
    payment_main_service: Annotated[PaymentMainService, Depends()],
    purchase_id: UUID,
    authority: str = Query(..., alias="Authority"),  
    status: str = Query(..., alias="Status"),
):
    return await payment_main_service.confirm_payment(purchase_id, authority, status)

