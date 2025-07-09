from datetime import datetime, timedelta, timezone
from typing import Annotated
from loguru import logger
from app.domain.schemas.member_schema import MemberLoginSchema
from app.domain.schemas.admin_schema import AdminLoginSchema
from fastapi import Depends, HTTPException, status
from app.domain.models.member_model import Member
from app.services.auth_services.hash_service import HashService
from app.services.base_service import BaseService
from app.services.member_service import MemberService
from app.services.admin_service import AdminService
from app.domain.schemas.token_schema import TokenSchema
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt 
from app.domain.models.admin_model import Admin 

http_bearer = HTTPBearer() 
        
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

    async def authenticate_member(self, member: MemberLoginSchema) -> TokenSchema:
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


    async def authenticate_admin(self, admin: AdminLoginSchema) -> TokenSchema:
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


async def get_current_member(
    member_service: Annotated[MemberService, Depends()],
    token: HTTPAuthorizationCredentials = Depends(http_bearer), 

) -> Member:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    logger.info(f"Validating token for member {token}")
    
    try:

        payload = jwt.decode(
            token.credentials,
            member_service.config.JWT_SECRET_KEY,
            algorithms=[member_service.config.JWT_ALGORITHM],
        )
        member_id: str = payload.get("sub")
        role: str = payload.get("role") 

        if role != "member":
            raise credentials_exception

        member = await member_service.get_member_by_id(member_id)
        if not member:
            logger.error("member not found")
            raise credentials_exception

    except jwt.PyJWTError:
        logger.error("Error decoding token")
        raise credentials_exception

    logger.info(f"member with id {member_id} validated successfully")
    return member





async def get_current_admin(
    admin_service: Annotated[AdminService, Depends()],
    token: HTTPAuthorizationCredentials = Depends(http_bearer),  

) -> Admin:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    logger.info(f"Validating token for admin {token}")
    
    try:
        payload = jwt.decode(
            token.credentials,
            admin_service.config.JWT_SECRET_KEY,
            algorithms=[admin_service.config.JWT_ALGORITHM],
        )
        admin_id: str = payload.get("sub")
        role: str = payload.get("role")  

        if role != "admin":
            raise credentials_exception

        admin = await admin_service.get_admin_by_id(admin_id)
        if not admin:
            logger.error("admin not found")
            raise credentials_exception

    except jwt.PyJWTError:
        logger.error("Error decoding token")
        raise credentials_exception

    logger.info(f"admin with id {admin_id} validated successfully")
    return admin
