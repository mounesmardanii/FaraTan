from typing import Annotated, Dict, List
from loguru import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.models.member_model import Member, MemberProfile, BodyMeasurement, BodyMeasurementHistory
from uuid import UUID
from datetime import datetime, timedelta
from sqlalchemy import func


class MemberRepository:
  def __init__(self, db: Annotated[Session, Depends(get_db)]):
    self.db = db

  def create_member(self, member: Member) -> Member:
    self.db.add(member)
    self.db.commit()
    self.db.refresh(member)
    logger.info(f"✅member {member.id} created")
    return member

  def get_member_by_number(self, number: str) -> Member:
    logger.info(f"📥Fetching member with number: {number}")
    return self.db.query(Member).filter(Member.phone_number == number).first()


  def get_member_by_id(self, member_id: UUID) -> Member:
    logger.info(f"📥 Fetching member with id: {member_id}")
    return self.db.query(Member).filter(Member.id == member_id).first()

  def get_member_growth_last_three_months(self):
        now = datetime.utcnow()
        three_months_ago = now - timedelta(days=90)

        result = (
            self.db.query(
                func.to_char(Member.created_at, 'YYYY-MM').label("month"),
                func.count(Member.id).label("member_count")
            )
            .filter(Member.created_at >= three_months_ago)
            .group_by("month")
            .order_by("month")
            .all()
        )

        return result