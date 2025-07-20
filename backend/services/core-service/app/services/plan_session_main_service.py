from fastapi import Depends, HTTPException
from typing import List, Optional, Annotated
from uuid import UUID
from app.services.plan_session_service import PlanSessionService
from app.domain.schemas.plan_session_schema import PlanSessionCreateSchema, PlanSessionResponseSchema, PlanSessionUpdateSchema
from app.services.plan_purchase_service import PlanPurchaseService

class PlanSessionMainService:
    def __init__(
            self,
            service: Annotated[PlanSessionService, Depends()],
            purchase_service: Annotated[PlanPurchaseService, Depends()] ):
        self.service = service
        self.purchase_service = purchase_service
        
    async def create_session(self, data: PlanSessionCreateSchema) -> PlanSessionResponseSchema:
        session = await self.service.create(data)
        return PlanSessionResponseSchema.from_orm(session)


    async def get_sessions_by_plan_id(self, plan_id:UUID) -> List[PlanSessionResponseSchema]:
        sessions = await self.service.get_sessions_by_plan_id(plan_id)
        return [PlanSessionResponseSchema.from_orm(p) for p in sessions]

    async def get_session_by_id(self, session_id: UUID) -> Optional[PlanSessionResponseSchema]:
        session = await self.service.get_by_id(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return PlanSessionResponseSchema.from_orm(session)
    
    async def update_session(self, session_id: UUID, update_fields: PlanSessionUpdateSchema) -> PlanSessionResponseSchema:
        session = await self.service.get_by_id(session_id)
        if session is None or session.is_active is False:
            raise HTTPException(status_code=404, detail="Session not found or inactive")

        if "price" in update_fields and update_fields["price"] < 0:
            raise HTTPException(status_code=400, detail="Price cannot be negative")

        update_fields = update_fields.model_dump(exclude_unset=True)

        updated = await self.service.update_session(session_id, update_fields)
        return PlanSessionResponseSchema.from_orm(updated)
    
    async def delete_session(self, session_id: UUID) -> bool:
        is_bought = await self.purchase_service.get_purchase_by_session_id(session_id)
        if is_bought:
            raise HTTPException(status_code=403, detail="Someone already paid for this")
        return await self.service.delete_session(session_id)
    
    async def get_sessions_by_trainer_id(self, trainer_id: UUID) -> List[PlanSessionResponseSchema]:
        sessions = await self.service.get_sessions_by_trainer_id(trainer_id)
        return [PlanSessionResponseSchema.from_orm(session) for session in sessions]


    async def deactivate_session(self, session_id: UUID):
        session = await self.service.get_by_id(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        if not session.is_active:
            raise HTTPException(status_code=400, detail="Session is already deactive")

        return await self.service.update_session(session_id, {"is_active": False})
