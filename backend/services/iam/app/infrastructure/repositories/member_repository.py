from typing import Annotated, Dict
from loguru import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.models.member_model import Member, MemberProfile
from uuid import UUID


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
    

  def create_profile(self, profile: MemberProfile) -> MemberProfile:
    self.db.add(profile)
    self.db.commit()
    logger.info(f"✅profile created")
    self.db.refresh(profile)
    return profile    

  def get_profile_by_member_id(self, member_id: UUID) -> MemberProfile:
    logger.info(f"📥 Fetching profile for member with id: {member_id}")
    return self.db.query(MemberProfile).filter(MemberProfile.member_id == member_id).first()
  

  def update_profile_by_member_id(self, member_id: UUID, update_fields: Dict) -> MemberProfile:
    profile_query = self.db.query(MemberProfile).filter(MemberProfile.member_id == member_id)
    profile_db = profile_query.first()
    if profile_db:
        profile_query.update(update_fields, synchronize_session=False)
        self.db.commit()
        self.db.refresh(profile_db)
        logger.info(f"✅ Profile for member {member_id} updated")
        return profile_db
    else:
        logger.warning(f"⚠️ Profile for member {member_id} not found")
        return None