from typing import Annotated, Dict
from loguru import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.models.admin_model import Admin
from uuid import UUID


class AdminRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def get_admin_by_phone_number(self, phone_number: str) -> Admin:
        logger.info(f"📥Fetching admin with phone_number: {phone_number}")
        return self.db.query(Admin).filter(Admin.phone_number == phone_number).first()

    def update_admin(self, admin_id: UUID, updated_admin: Dict) -> Admin:
        admin_query = self.db.query(Admin).filter(Admin.admin_id == admin_id)
        db_admin = admin_query.first()

        if db_admin:
            admin_query.update(updated_admin, synchronize_session=False)
            self.db.commit()
            self.db.refresh(db_admin)
            logger.info(f"✅ admin {admin_id} updated")
            return db_admin
        else:
            logger.warning(f"⚠️ admin {admin_id} not found")
            return None

    def get_admin_by_id(self, admin_id: UUID) -> Admin:
        logger.info(f"📥 Fetching Admin with id: {admin_id}")
        return self.db.query(Admin).filter(Admin.admin_id == admin_id).first()
