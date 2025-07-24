from uuid import UUID
from typing import List, Annotated
from fastapi import Depends, HTTPException
from app.services.plan_purchase_service import PlanPurchaseService
from app.domain.schemas.purchase_schema import PlanPurchaseResponseSchema, ManualPurchaseCreateSchema, ManualPurchaseUpdateSchema
from app.services.plan_service import PlanService
from app.services.plan_session_service import PlanSessionService
from app.services.member_service import MemberService

class PlanPurchaseMainService:
    def __init__(self,
        service: Annotated[PlanPurchaseService, Depends()],
        plan_service: Annotated[PlanService, Depends()],
        session_service: Annotated[PlanSessionService, Depends()],
        member_service: Annotated[MemberService, Depends()]
        ):
        self.service = service
        self.plan_service = plan_service
        self.session_service = session_service
        self.member_service = member_service

    async def get_my_purchases(self, member_id: UUID) -> List[PlanPurchaseResponseSchema]:
        purchases = await self.service.get_purchases_by_member_id(member_id)
        return [PlanPurchaseResponseSchema.from_orm(p) for p in purchases]
    
    async def get_all_purchases(self) -> List[PlanPurchaseResponseSchema]:
        purchases = await self.service.get_all_purchases()
        return [PlanPurchaseResponseSchema.from_orm(p) for p in purchases]
    

    async def get_purchase_stats(self):
        return await self.service.get_plan_purchase_counts()
    
    async def get_my_purchased_plans(self, member_id: UUID):
        return await self.service.get_purchased_plans_by_member(member_id)


    async def create_manual_purchase(self, data: ManualPurchaseCreateSchema):
        return await self.service.create_manual_purchase(data)
    

    async def update_manual_purchase(self, purchase_id: UUID, data: ManualPurchaseUpdateSchema):
        old = await self.service.get_purchase_by_id(purchase_id)
        if not old or old.payment_method == "online":
            raise HTTPException(status_code=403, detail="Only manual payments can be edited.")

        await self.service.mark_as_canceled(old)

        if 'session_id' in data:
            session = await self.session_service.get_by_id(data.session_id)
            if not session:
                raise HTTPException(status_code=404, detail="Session not found")
            session_id = data.session_id
            price = session.price
        else:
            session_id = old.session_id
            price = old.amount

        if 'member_id' in data:
            member = await self.member_service.get_member_by_id(data.member_id)
            new_member_id= data.member_id

        else:
            new_member_id = old.member_id

        if 'payment_method' in data:
            payment_method = data.payment_method
        else:
            payment_method = old.payment_method

        schema = ManualPurchaseCreateSchema(
            member_id=new_member_id,
            session_id=session_id,
            amount=price,
            payment_method=payment_method
        )

        return await self.service.create_manual_purchase(schema)
    
    async def cancel_manual_purchase(self, purchase_id: UUID):
        purchase = await self.service.get_purchase_by_id(purchase_id)
        if not purchase or purchase.payment_method == "online":
            raise HTTPException(status_code=403, detail="Only manual payments can be canceled.")
        if purchase.status == 'Canceled':
            raise HTTPException(status_code=403, detail="Session already canceled.")

        return self.service.mark_as_canceled(purchase)