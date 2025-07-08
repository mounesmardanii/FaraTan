from pydantic import BaseModel, ConfigDict, StringConstraints
from datetime import date, datetime
from typing import Optional
from uuid import UUID
from typing import Annotated
class MemberCreateSchema(BaseModel):
    full_name: str  
    phone_number: str 
    gender: Optional[str]  
    birthdate: Optional[date]  
    national_id: Annotated[str, StringConstraints(min_length=10, max_length=10, pattern=r"^\d{10}$")]
    password:str

    class Config:
        from_attributes = True


class MemberResponseSchema(BaseModel):
    id: UUID
    full_name: str
    phone_number: str
    gender: Optional[str]
    birthdate: Optional[date]
    national_id: str
    profile_image: Optional[str]
    is_verified:bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

