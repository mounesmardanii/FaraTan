from fastapi import Depends, HTTPException
from typing import List, Optional, Annotated
from uuid import UUID
from app.services.sports_service import GymSportsService
from app.domain.schemas.sports_schema import GymSportsResponseSchema




class GymSportsMainService:
    def __init__(self, service: Annotated[GymSportsService, Depends()]):
        self.service = service

    async def get_all_sports(self) -> List[GymSportsResponseSchema]:
        sports = await self.service.get_all_sports()
        return [GymSportsResponseSchema.from_orm(s) for s in sports]

            