from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, DECIMAL, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Plan(Base):
    __tablename__ = "plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(50), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

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

    
class PlanPurchase(Base):
    __tablename__ = "plan_purchases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    member_id = Column(UUID(as_uuid=True), nullable=False)
    session_id = Column(UUID(as_uuid=True), ForeignKey("plan_sessions.id", ondelete="CASCADE"), nullable=False)
    amount = Column(DECIMAL(10,2), nullable=False)
    status = Column(String(20), default="pending")  
    paid_at = Column(DateTime, nullable=True)
    payment_method = Column(String, default="online", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("PlanSession", backref="purchases")

