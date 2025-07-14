from sqlalchemy import Column, String, Date, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base
import uuid
from uuid import UUID

Base = declarative_base()

class Trainer(Base):
    __tablename__ = "trainers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, nullable=False)
    specialty = Column(String, nullable=False)
    birth_date = Column(Date, nullable=False)
    start_date = Column(Date, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

