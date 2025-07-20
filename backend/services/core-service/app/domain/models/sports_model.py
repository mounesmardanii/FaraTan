from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class GymSports(Base):
    __tablename__ = "gym_sports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)