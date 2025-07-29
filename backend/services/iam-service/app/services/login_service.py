from app.services.auth_services.auth_service import AuthService
from typing import Annotated
from fastapi import Depends, HTTPException
from app.services.base_service import BaseService
from fastapi.security import OAuth2PasswordRequestForm
from app.domain.schemas.login_schema import LoginSchema

class LoginService(BaseService):
    def __init__(
        self,
        auth_service: Annotated[AuthService, Depends()],
    ) -> None:
        super().__init__()
        self.auth_service = auth_service

    async def login(self, form_data:OAuth2PasswordRequestForm):
        result = await self.auth_service.get_user_by_phone(form_data.username)

        if result["role"] == "admin":
            return await self.auth_service.authenticate_admin(
                LoginSchema(phone_number=form_data.username, password=form_data.password)
            )
        elif result["role"] == "member":
            return await self.auth_service.authenticate_member(
                LoginSchema(phone_number=form_data.username, password=form_data.password)
            )
        else:
            raise HTTPException(status_code=400, detail="Unsupported role")
