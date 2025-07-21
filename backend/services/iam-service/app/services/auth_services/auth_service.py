from datetime import datetime, timedelta, timezone
from typing import Annotated
from loguru import logger
from fastapi import Depends, HTTPException, status
from app.services.auth_services.hash_service import HashService
from app.services.base_service import BaseService
from app.services.member_service import MemberService
from app.services.admin_service import AdminService
from app.domain.schemas.token_schema import TokenSchema
from fastapi.security import OAuth2PasswordBearer
import jwt 
from app.core.configs.config import Settings, get_settings
from app.domain.schemas.login_schema import LoginSchema


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
        
class AuthService(BaseService):
    def __init__(
        self,
        hash_service: Annotated[HashService, Depends()],
        admin_service: Annotated[AdminService, Depends()],
        member_service: Annotated[MemberService, Depends()],
    ) -> None:
        super().__init__()
        self.member_service = member_service
        self.admin_service = admin_service
        self.hash_service = hash_service

    async def authenticate_member(self, member: LoginSchema) -> TokenSchema:
        existing_member = await self.member_service.get_member_by_number(
            member.phone_number
        )
        logger.info(f"Authenticating member with number: {member.phone_number}")

        if not existing_member:
            logger.error(f"member with number {member.phone_number} does not exist")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="member does not exist"
            )

        if self.config.ENABLE_OTP and not existing_member.is_verified:
            logger.error(f"member with number {member.phone_number} is not verified")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="member is not verified"
            )

        if not self.hash_service.verify_password(
            member.password, existing_member.password
        ):
            logger.error(f"Invalid password for member with number {member.phone_number}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect membername or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = self.create_access_token(data={"sub": str(existing_member.id), "role": "member"})

        logger.info(f"member with number {member.phone_number} authenticated successfully")
        return TokenSchema(access_token=access_token, token_type="bearer")

    async def authenticate_admin(self, admin: LoginSchema) -> TokenSchema:
        existing_admin = await self.admin_service.get_admin_by_phone_number(
            admin.phone_number
        )
        logger.info(f"Authenticating admin with phone_number: {admin.phone_number}")

        if not existing_admin:
            logger.error(f"admin with phone_number {admin.phone_number} does not exist")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="admin does not exist"
            )


        if not self.hash_service.verify_password(
            admin.password, existing_admin.password
        ):
            logger.error(f"Invalid password for admin with phone_number {admin.phone_number}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect adminname or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = self.create_access_token(data={"sub": str(existing_admin.admin_id), "role": "admin"})
        logger.info(f"admin with phone_number {admin.phone_number} authenticated successfully")
        return TokenSchema(access_token=access_token, token_type="bearer")

    

    def create_access_token(self, data: dict) -> str:
        logger.info("Creating access token")
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(
            self.config.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, self.config.JWT_SECRET_KEY, algorithm=self.config.JWT_ALGORITHM
        )
        return encoded_jwt
    

    async def get_user_by_phone(self, phone: str):
        admin = await self.admin_service.get_admin_by_phone_number(phone)
        if admin:
            return {"role": "admin", "user": admin}

        member = await self.member_service.get_member_by_number(phone)
        if member:
            return {"role": "member", "user": member}

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )


async def get_current_user_by_role(
    role: str,
    token: Annotated[str, Depends(oauth2_scheme)],
    config: Annotated[Settings, Depends(get_settings)],
    member_service: Annotated[MemberService, Depends()] = None,
    admin_service: Annotated[AdminService, Depends()] = None,
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            config.JWT_SECRET_KEY,
            algorithms=[config.JWT_ALGORITHM],
        )
        user_id: str = payload.get("sub")
        user_role: str = payload.get("role")

        if user_role != role:
            raise credentials_exception

        if role == "member" and member_service:
            user = await member_service.get_member_by_id(user_id)
        elif role == "admin" and admin_service:
            user = await admin_service.get_admin_by_id(user_id)
        else:
            raise credentials_exception

        if not user:
            raise credentials_exception

        return user

    except jwt.PyJWTError:
        raise credentials_exception



async def get_current_admin(
    token: Annotated[str, Depends(oauth2_scheme)],
    config: Annotated[Settings, Depends(get_settings)],
    admin_service: Annotated[AdminService, Depends()],
):
    return await get_current_user_by_role(
        role="admin",
        token=token,
        config=config,
        admin_service=admin_service
    )

async def get_current_member(
    token: Annotated[str, Depends(oauth2_scheme)],
    config: Annotated[Settings, Depends(get_settings)],
    member_service: Annotated[MemberService, Depends()],
):
    return await get_current_user_by_role(
        role="member",
        token=token,
        config=config,
        member_service=member_service
    )