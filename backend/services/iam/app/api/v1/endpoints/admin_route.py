from fastapi import Depends, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from loguru import logger
from app.domain.schemas.admin_schema import AdminLoginSchema
from app.domain.schemas.token_schema import TokenSchema
from app.services.auth_services.auth_service import AuthService

admin_router = APIRouter()





@admin_router.post("/login", response_model=TokenSchema, status_code=status.HTTP_200_OK)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: Annotated[AuthService, Depends()],
) -> TokenSchema:

    logger.info(f"Logging in admin with phone_number {form_data.username}")
    return await auth_service.authenticate_admin(
        AdminLoginSchema(phone_number=form_data.username, password=form_data.password)
    )    
