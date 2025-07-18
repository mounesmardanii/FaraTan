from sqlalchemy import Column, String, Date, TIMESTAMP, func, Integer, DateTime, ForeignKey
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
    created_at = Column(DateTime, default=datetime.utcnow)