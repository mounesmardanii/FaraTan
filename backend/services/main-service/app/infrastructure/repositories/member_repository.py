from typing import Annotated, Dict, List
from loguru import logger
from app.core.postgres_db.database import get_db
from app.domain.models.member_model import Member
from uuid import UUID
from datetime import datetime, timedelta
from sqlalchemy import func
from app.utils.date_helper import to_jalali_month_str
from fastapi import Depends
from sqlalchemy.orm import Session


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
  
  def get_all_members(self) -> List[Member]:
    return self.db.query(Member).all()

  def get_member_by_id(self, member_id: UUID) -> Member:
    logger.info(f"📥 Fetching member with id: {member_id}")
    return self.db.query(Member).filter(Member.id == member_id).first()

  def update_member(self, member_id: UUID, updated_member: Dict) -> Member:
    member_query = self.db.query(Member).filter(Member.id == member_id)
    db_member = member_query.first()

    if db_member:
      member_query.update(updated_member, synchronize_session=False)
      self.db.commit()
      self.db.refresh(db_member)
      logger.info(f"✅ member {member_id} updated")
      return db_member
    else:
          logger.warning(f"⚠️ member {member_id} not found")
          return None
    
  
  def delete_member_by_id(self, member_id: int) -> None:
      member = self.db.query(Member).filter(Member.id == member_id).first()
      self.db.delete(member)
      self.db.commit()
      logger.info(f"🗑️ Member with ID {member_id} deleted from DB")


  def get_member_growth_last_three_months(self):
      now = datetime.utcnow()
      three_months_ago = now - timedelta(days=90)

      result = (
          self.db.query(
              func.date_trunc('month', Member.created_at).label("month"),
              func.count(Member.id).label("member_count")
          )
          .filter(Member.created_at >= three_months_ago)
          .group_by("month")
          .order_by("month")
          .all()
      )

      return [
          {
              "month": to_jalali_month_str(row.month),
              "member_count": row.member_count
          }
          for row in result
      ]
    
