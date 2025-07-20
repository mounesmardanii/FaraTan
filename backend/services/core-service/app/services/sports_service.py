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