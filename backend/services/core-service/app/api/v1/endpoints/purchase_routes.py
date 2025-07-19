from fastapi import APIRouter, Depends, status
from typing import List, Annotated
from uuid import UUID
from app.services.purchase_main_service import PlanPurchaseMainService
from app.services.auth_services.auth_service import get_current_member
from app.domain.schemas.token_schema import TokenDataSchema
from app.domain.schemas.purchase_schema import PlanPurchaseResponseSchema

purchase_router = APIRouter(prefix="/purchases", tags=["Purchases"])

@purchase_router.get("/my", response_model=List[PlanPurchaseResponseSchema], status_code=status.HTTP_200_OK)
async def get_my_purchases(
    current_member: Annotated[TokenDataSchema, Depends(get_current_member)],
    service: Annotated[PlanPurchaseMainService, Depends()],
):
    return await service.get_my_purchases(current_member.id)
