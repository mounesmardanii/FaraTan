from sqlalchemy import Column, String, TIMESTAMP, func, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Movement(Base):
    __tablename__ = "movements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    video_url = Column(String, nullable=True)
    is_vip = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())