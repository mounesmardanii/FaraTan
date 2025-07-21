from sqlalchemy import Column, String, Date, TIMESTAMP, func, Integer, DateTime, ForeignKey, Boolean, Text, Time
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Plan(Base):
    __tablename__ = "plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(50), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    

class Trainer(Base):
    __tablename__ = "trainers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, nullable=False)
    specialty = Column(String, nullable=False)
    birth_date = Column(Date, nullable=False)
    age = Column(Integer)
    years_of_experience = Column(Integer)
    start_date = Column(Date, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())


class PlanSession(Base):
    __tablename__ = "plan_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id", ondelete="CASCADE"), nullable=False)
    trainer_id = Column(UUID(as_uuid=True), ForeignKey("trainers.id", ondelete="CASCADE"), nullable=False)
    capacity = Column(Integer, nullable=False)
    session_count = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Member(Base):
    __tablename__ = 'members'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    full_name = Column(String(100))
    phone_number = Column(String(20))
    national_id = Column(String(20))
    password = Column(String(20), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    can_reset_password = Column(Boolean, default=False, nullable=False)
    profile_image = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class GymSchedule(Base):
    __tablename__ = "session_schedules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    session_id = Column(UUID(as_uuid=True), nullable=False)
    sport_id = Column(UUID(as_uuid=True), ForeignKey("gym_sports.id", ondelete="CASCADE"), nullable=False)
    weekday = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    member_id = Column(UUID(as_uuid=True), ForeignKey("members.id", ondelete="CASCADE"), nullable=False)
    session_id = Column(UUID(as_uuid=True), ForeignKey("plan_sessions.id", ondelete="CASCADE"), nullable=False)
    session_schedule_id = Column(UUID(as_uuid=True), ForeignKey("session_schedules.id", ondelete="CASCADE"), nullable=False)  # 🔥 اضافه‌شده
    reserved_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="Reserved")
