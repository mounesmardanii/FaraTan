
from fastapi import Depends, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from app.domain.schemas.token_schema import TokenSchema, TokenDataSchema
from typing import Annotated
from app.services.auth_services.auth_service import AuthService

from app.services.login_service import LoginService

login_router = APIRouter()

@login_router.post("/login", response_model=TokenSchema)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    login_service: Annotated[LoginService, Depends()],
):
  return await login_service.login(form_data)
