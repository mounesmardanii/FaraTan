from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from loguru import logger
from app.infrastructure.clients.iam_client import IAMClient
from app.domain.schemas.token_schema import MemberTokenDataSchema
from app.core.config.config import get_settings

config = get_settings()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"http://127.0.0.1:8000/api/v1/auth/login", scheme_name="MemberOAuth2")


async def get_current_member(
        token: Annotated[str, Depends(oauth2_scheme)],
        client: Annotated[IAMClient, Depends()],
) -> MemberTokenDataSchema:
    if not token:
        logger.error("No token provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )

    logger.info(f"Validating token {token}")
    return await client.validate_member_token(token)