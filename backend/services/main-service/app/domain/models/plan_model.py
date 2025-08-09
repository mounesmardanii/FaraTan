from sqlalchemy import Column, String, Text, DateTime, Integer, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Plan(Base):
    __tablename__ = "plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(50), unique=True, nullable=False)
    session_count = Column(Integer, nullable=False)
    price = Column(DECIMAL(10,2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
