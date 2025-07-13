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
    national_id = Column(String(20))
    password = Column(String(20), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    can_reset_password = Column(Boolean, default=False, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    profile = relationship("MemberProfile", back_populates="member", uselist=False)
    body_measurements = relationship("BodyMeasurement", back_populates="member", uselist=False)


class MemberProfile(Base):
    __tablename__ = "member_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    member_id = Column(UUID(as_uuid=True), ForeignKey("members.id", ondelete="CASCADE"), nullable=False)

    height = Column(Float, nullable=True)
    gender = Column(String(10), nullable=True)
    birthdate = Column(Date, nullable=True)
    age = Column(Integer, nullable=True)
    health_conditions = Column(Text, nullable=True)
    fitness_goals = Column(String(100), nullable=True)
    profile_image = Column(String(255), nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

    member = relationship("Member", back_populates="profile", lazy="joined")


class BodyMeasurement(Base):
    __tablename__ = 'body_measurements'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    member_id = Column(UUID(as_uuid=True), ForeignKey('members.id', ondelete='CASCADE'), nullable=False)

    bmi = Column(Float)
    weight = Column(Float)
    waist_circumference = Column(Float)
    hip_circumference = Column(Float)
    arm_circumference = Column(Float)
    chest_circumference = Column(Float)
    thigh_circumference = Column(Float)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    member = relationship("Member", back_populates="body_measurements", lazy="joined")    