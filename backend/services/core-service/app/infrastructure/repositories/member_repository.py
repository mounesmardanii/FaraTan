from typing import Annotated, Dict, List
from loguru import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.models.member_model import Member, MemberProfile, BodyMeasurement, BodyMeasurementHistory
from uuid import UUID
from datetime import datetime, timedelta
from sqlalchemy import func
from app.utils.date_helper import to_jalali_month_str

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
    
    def get_monthly_weight_trend(self, member_id: UUID) -> List[Dict]:
          subquery = (
              self.db.query(
                  BodyMeasurementHistory,
                  func.date_trunc('month', BodyMeasurementHistory.created_at).label('month'),
                  func.row_number().over(
                      partition_by=func.date_trunc('month', BodyMeasurementHistory.created_at),
                      order_by=BodyMeasurementHistory.created_at.desc()
                  ).label('rn')
              )
              .filter(BodyMeasurementHistory.member_id == member_id)
              .subquery()
          )

          result = (
              self.db.query(subquery.c.month, subquery.c.weight)
              .filter(subquery.c.rn == 1)
              .order_by(subquery.c.month)
              .all()
          )

          return [{"month": r.month.strftime("%B"), "weight": float(r.weight)} for r in result]
    

    def get_member_profile(self, member_id: UUID) -> MemberProfile:
        return self.db.query(MemberProfile).filter_by(member_id=member_id).first()

    def get_latest_measurement(self, member_id: UUID) -> BodyMeasurement:
        return (
            self.db.query(BodyMeasurement)
            .filter_by(member_id=member_id)
            .order_by(BodyMeasurement.created_at.desc())
            .first()
        )