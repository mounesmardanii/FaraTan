from sqlalchemy import Column, String, Text, TIMESTAMP, func, Boolean, Date, Integer, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid
from sqlalchemy.orm import relationship
Base = declarative_base()

class Member(Base):
    __tablename__ = 'members'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(100))
    phone_number = Column(String(20))
    birthdate = Column(Date, nullable=True)
    health_conditions = Column(Text, nullable=True)
    fitness_goals = Column(String(100), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
