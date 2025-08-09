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
    session_count = Column(Integer, nullable=False)
    price = Column(DECIMAL(10,2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    
class PlanPurchase(Base):
    __tablename__ = "plan_purchases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    member_id = Column(UUID(as_uuid=True), nullable=False)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id", ondelete="CASCADE"), nullable=False)
    amount = Column(DECIMAL(10,2), nullable=False)
    session_count = Column(Integer, nullable=False)
    paid_at = Column(DateTime, nullable=True)
    payment_method = Column(String, nullable=False)
    status = Column(String(20))  
    created_at = Column(DateTime, default=datetime.utcnow)

    plan = relationship("Plan", backref="purchases")

