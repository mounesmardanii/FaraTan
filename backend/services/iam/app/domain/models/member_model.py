from sqlalchemy import Column, String, Text, TIMESTAMP, func, Boolean, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Member(Base):
    __tablename__ = 'members'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(100))
    phone_number = Column(String(20))
    gender = Column(String(10))
    birthdate = Column(Date)
    national_id = Column(String(20))
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    profile_image = Column(String(255))
