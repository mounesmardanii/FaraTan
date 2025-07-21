from app.domain.models.sports_model import GymSports
from app.infrastructure.repositories.sports_repository import SportsRepository
from typing import Annotated, List
from loguru import logger
from fastapi import Depends, HTTPException, status
from datetime import date

class GymSportsService:
    def __init__(self, repo: Annotated[SportsRepository, Depends()]):
        self.repo = repo

    async def get_all_sports(self) -> List[GymSports]:
        return self.repo.get_all_sports()
    

    # async def create_sport(self, data: CreateGymSportSchema) -> GymSports:
    #     sport = GymSports(**data.model_dump())
    #     return self.repo.create_sport(sport)

    # async def get_sport_by_id(self, sport_id: UUID) -> GymSports:
    #     sport = self.repo.get_sport_by_id(sport_id)
    #     if not sport:
    #         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sport not found")
    #     return sport