from fastapi import APIRouter, Depends, status
from typing import List, Annotated
from uuid import UUID
from app.services.sports_main_service import GymSportsMainService
from app.domain.schemas.sports_schema import GymSportsResponseSchema

gym_sports_router = APIRouter()


@gym_sports_router.get("/", response_model=List[GymSportsResponseSchema])
async def get_all_sports(
    service: Annotated[GymSportsMainService, Depends()]
):
    return await service.get_all_sports()