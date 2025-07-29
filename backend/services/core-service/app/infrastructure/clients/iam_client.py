from typing import Annotated
from loguru import logger
from fastapi import Depends
from app.core.configs.config import get_settings, Settings
from app.domain.schemas.token_schema import AdminTokenDataSchema, MemberTokenDataSchema
from app.infrastructure.clients.http_client import HTTPClient


class IAMClient:
    def __init__(
            self,
            http_client: Annotated[HTTPClient, Depends()],
            config: Settings = Depends(get_settings),
    ):
        self.config = config
        self.http_client = http_client

    async def validate_member_token(self, token: str) -> MemberTokenDataSchema:
        headers = {"Authorization": f"Bearer {token}"}
        async with self.http_client as client:
            response = await client.get(
                f"{self.config.IAM_URL}/api/v1/members/Me", headers=headers
            )
            response.raise_for_status()
            logger.info(f"Token {token} validated")
            return MemberTokenDataSchema(**response.json())    


    async def validate_admin_token(self, token: str) -> AdminTokenDataSchema:
        headers = {"Authorization": f"Bearer {token}"}
        async with self.http_client as client:
            response = await client.get(
                f"{self.config.IAM_URL}/api/v1/admins/Me", headers=headers
            )
            response.raise_for_status()
            logger.info(f"Token {token} validated")
            return AdminTokenDataSchema(**response.json())                