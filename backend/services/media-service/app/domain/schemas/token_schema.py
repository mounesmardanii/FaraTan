from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional
from uuid import UUID

class TokenSchema(BaseModel):
    access_token: str
    token_type: str


class MemberTokenDataSchema(BaseModel):
    id: UUID
    full_name: str
    phone_number: str
    national_id: str
    is_verified:bool
    can_reset_password:bool
    profile_image: Optional[str] = None
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class AdminTokenDataSchema(BaseModel):
    admin_id: UUID
    phone_number: str 
    can_reset_password: bool
    class Config:
        from_attributes = True