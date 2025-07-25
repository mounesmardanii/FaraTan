from fastapi import Depends, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from loguru import logger
# from app.domain.schemas.member_schema import
from app.domain.schemas.token_schema import TokenSchema, TokenDataSchema
from app.services.member_main_service import MemberMainService
member_router = APIRouter()
