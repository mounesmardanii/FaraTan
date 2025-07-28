from sqlalchemy import Column, String, Date, TIMESTAMP, func, Integer, DateTime, ForeignKey, Boolean, Text, UniqueConstraint, Numeric
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


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

    program_member = relationship("ProgramMovement", back_populates="member")

class Movement(Base):
    __tablename__ = "movements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title = Column(String, nullable=False)
    video_url = Column(String, nullable=True)
    is_vip = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    program_movements = relationship("ProgramMovement", back_populates="movement")


class ProgramMovement(Base):
    __tablename__ = "program_movements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    member_id = Column(UUID(as_uuid=True), ForeignKey("members.id", ondelete="CASCADE"), nullable=False)
    movement_id = Column(UUID(as_uuid=True), ForeignKey("movements.id", ondelete="CASCADE"), nullable=False)
    sets = Column(Integer, nullable=True)
    duration = Column(Integer, nullable=True)
    reps = Column(Integer, nullable=True)
    weight = Column(Numeric(5, 2), nullable=True)


    movement = relationship("Movement", back_populates="program_movements")
    member = relationship("Member", back_populates="program_member")

    __table_args__ = (
        UniqueConstraint('member_id', 'movement_id', name='uniq_member_movement_order'),
    )