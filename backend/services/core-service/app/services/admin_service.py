from typing import Annotated, Dict
from loguru import logger
from  app.domain.models.admin_model import Admin
from  app.infrastructure.repositories.admin_repository import AdminRepository
from  app.services.base_service import BaseService
from uuid import UUID
from fastapi import Depends, HTTPException
class AdminService(BaseService):
    def __init__(
        self,
        admin_repository: Annotated[AdminRepository, Depends()],
    ) -> None:
        super().__init__()
        self.admin_repository = admin_repository

    async def get_admin_by_phone_number(self, phone_number: str) -> Admin:
        logger.info(f"📥 Fetching admin with phone_number {phone_number}")
        return self.admin_repository.get_admin_by_phone_number(phone_number)

    async def get_admin_by_id(self, admin_id: UUID) -> Admin:  
        logger.info(f"📥 Fetching admin with id {admin_id}")
        return self.admin_repository.get_admin_by_id(admin_id)  

