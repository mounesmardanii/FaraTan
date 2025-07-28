from typing import Annotated
from loguru import logger
from fastapi import Depends, HTTPException, status
from app.services.base_service import BaseService
from app.services.member_service import MemberService
from uuid import UUID
from app.domain.schemas.token_schema import TokenSchema
class MemberMainService(BaseService):
    def __init__(
        self,
        member_service: Annotated[MemberService, Depends()],
    ) -> None:
        super().__init__()

        self.member_service = member_service

