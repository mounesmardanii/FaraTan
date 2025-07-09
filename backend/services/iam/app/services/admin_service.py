from typing import Annotated, Dict
from loguru import logger
from  app.domain.models.admin_model import Admin
from  app.infrastructure.repositories.admin_repository import AdminRepository
from  app.services.auth_services.hash_service import HashService
from  app.services.base_service import BaseService
from uuid import UUID
from app.services.auth_services.otp_service import OTPService
from fastapi import Depends, HTTPException

class AdminService(BaseService):
    def __init__(
        self,
        admin_repository: Annotated[AdminRepository, Depends()],
        hash_service: Annotated[HashService, Depends()],
        otp_service: Annotated[OTPService, Depends()],
    ) -> None:
        super().__init__()
        self.admin_repository = admin_repository
        self.hash_service = hash_service
        self.otp_service = otp_service



    async def get_admin_by_phone_number(self, phone_number: str) -> Admin:
        logger.info(f"📥 Fetching admin with phone_number {phone_number}")
        return self.admin_repository.get_admin_by_phone_number(phone_number)

    async def get_admin_by_id(self, admin_id: UUID) -> Admin:  
        logger.info(f"📥 Fetching admin with id {admin_id}")
        return self.admin_repository.get_admin_by_id(admin_id)  

    async def update_can_change_status(self, admin_id: UUID, update_fields: Dict) -> Admin: 
        logger.info(f"🔃 Updating admin with id {admin_id}")
        return self.admin_repository.update_admin(admin_id, update_fields)

    # async def change_admin_password(self, phone_number:str, update_fields: Dict) -> Admin:
    #     logger.info(f"🔃 Changing password admin with id {phone_number}")
    
        # update_fields['password'] = self.hash_service.hash_password(update_fields['password'])

        # admin = self.admin_repository.get_admin_by_phone_number(phone_number)
        # if admin.can_reset_password != True:
        #     raise HTTPException(status_code=400, detail='You need to verify the otp first')

        # self.admin_repository.update_admin(admin.admin_id, {"can_reset_password": False})    
        # return self.admin_repository.update_admin(admin.admin_id, update_fields)
    
    async def update_verified_status(self, admin_id: UUID, update_fields: Dict) -> Admin: 
        logger.info(f"🔃 Updating admin with id {admin_id}")
        return self.admin_repository.update_admin(admin_id, update_fields)