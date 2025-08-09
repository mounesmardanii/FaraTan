from app.infrastructure.repositories.member_repository import MemberRepository
from typing import Annotated
from fastapi import Depends

class StatService:
    def __init__(self, repo: Annotated[MemberRepository, Depends()]):
        self.repo = repo


