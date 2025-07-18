from sqlalchemy import Column, String, Text, TIMESTAMP, func, Boolean, Date, Integer, ForeignKey, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.ext.declarative import declarative_base
import uuid
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class Member(Base):
    __tablename__ = 'members'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(100))
    phone_number = Column(String(20))
    national_id = Column(String(20))
    password = Column(String(20), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    can_reset_password = Column(Boolean, default=False, nullable=False)
    profile_image = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())



class NutritionWeek(Base):
    __tablename__ = "nutrition_weeks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    member_id = Column(UUID(as_uuid=True), ForeignKey("members.id", ondelete="CASCADE"))
    title = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    days = relationship("NutritionDay", back_populates="week")

class NutritionDay(Base):
    __tablename__ = "nutrition_days"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    week_id = Column(UUID(as_uuid=True), ForeignKey("nutrition_weeks.id", ondelete="CASCADE"), nullable=False)
    day_of_week = Column(String(10), nullable=False)

    breakfast = Column(Text, nullable=True)
    snack = Column(ARRAY(Text), nullable=True)
    lunch = Column(Text, nullable=True)
    dinner = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    week = relationship("NutritionWeek", back_populates="days")