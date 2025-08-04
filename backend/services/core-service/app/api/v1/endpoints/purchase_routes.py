from fastapi import APIRouter, Depends, status
from typing import List, Annotated
from uuid import UUID
from app.services.purchase_main_service import PlanPurchaseMainService
from app.domain.schemas.purchase_schema import PlanPurchaseResponseSchema, ManualPurchaseCreateSchema,ManualPurchaseUpdateSchema

purchase_router = APIRouter()

@purchase_router.get("/my", response_model=List[PlanPurchaseResponseSchema], status_code=status.HTTP_200_OK)
async def get_my_purchases(
    # current_member: Annotated[MemberTokenDataSchema, Depends(get_current_member)],
    member_id:UUID,
    service: Annotated[PlanPurchaseMainService, Depends()],
):
    return await service.get_my_purchases(member_id)


@purchase_router.get("/purchase-table", response_model=List[PlanPurchaseResponseSchema], status_code=status.HTTP_200_OK)
async def get_all_purchases(
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)],
    service: Annotated[PlanPurchaseMainService, Depends()],
):
    return await service.get_all_purchases()

@purchase_router.get("/stats/plan-purchases", status_code=status.HTTP_200_OK)
async def get_plan_purchase_statistics(
    service: Annotated[PlanPurchaseMainService, Depends()],
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)],
):
    return await service.get_purchase_stats()


@purchase_router.get("/my-purchased-plans", status_code=status.HTTP_200_OK)
async def get_my_purchased_plans(
    # current_member: Annotated[MemberTokenDataSchema, Depends(get_current_member)],
    member_id:UUID,
    main_service: Annotated[PlanPurchaseMainService, Depends()]
):
    return await main_service.get_my_purchased_plans(member_id)


@purchase_router.post("/manual", status_code=status.HTTP_201_CREATED)
async def create_manual_purchase(
    data: ManualPurchaseCreateSchema,
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)],
    service: Annotated[PlanPurchaseMainService, Depends()],
):
    return await service.create_manual_purchase(data)


@purchase_router.put("/manual/{purchase_id}", status_code=status.HTTP_200_OK)
async def update_manual_purchase(
    purchase_id: UUID,
    data: ManualPurchaseUpdateSchema,
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)],
    service: Annotated[PlanPurchaseMainService, Depends()],
):
    return await service.update_manual_purchase(purchase_id, data)


@purchase_router.delete("/manual/{purchase_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_manual_purchase(
    purchase_id: UUID,
    # current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)],
    service: Annotated[PlanPurchaseMainService, Depends()],
):
    await service.cancel_manual_purchase(purchase_id)

    return {"detail": "Payment canceled successfully"}
