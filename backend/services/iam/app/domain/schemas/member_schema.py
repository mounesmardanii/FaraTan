from pydantic import BaseModel, ConfigDict, StringConstraints
from datetime import date, datetime
from typing import Optional
from uuid import UUID
from typing import Annotated

class MemberCreateSchema(BaseModel):
    full_name: str  
    phone_number: str 
    national_id: Annotated[str, StringConstraints(min_length=10, max_length=10, pattern=r"^\d{10}$")]
    password:str

    class Config:
        from_attributes = True


class MemberResponseSchema(BaseModel):
    id: UUID
    full_name: str
    phone_number: str
    national_id: str
    is_verified:bool
    can_reset_password:bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class VerifyOTPSchema(BaseModel):
    phone_number: str
    otp: str
    model_config = ConfigDict(from_attributes=True)

class VerifyOTPResponseSchema(BaseModel):
    verified: bool
    message: str


class MemberLoginSchema(BaseModel):
    phone_number: str
    password: str


class ResendOTPSchema(BaseModel):
    phone_number: str

class ResendOTPResponseSchema(BaseModel):
    phone_number: str
    message: str        




class ResetPasswordSchema(BaseModel):
    phone_number: str
    otp: str
    new_password: str
    confirm_password: str


class ForgetPasswordSchema(BaseModel):
    phone_number: str
    password: str
    confirm_password: str


class UpdateMemberInfoSchema(BaseModel):

    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    national_id: Optional[
        Annotated[str, StringConstraints(min_length=10, max_length=10, pattern=r"^\d{10}$")]
    ]= None
    password: Optional[str]= None
    confirm_password: Optional[str]= None

    class Config:
        from_attributes = True


class MemberProfileCreateSchema(BaseModel):
    height: Optional[float]
    gender: Optional[str]  
    birthdate: Optional[date]
    health_conditions: Optional[str]
    fitness_goals: Optional[str] 


class MemberProfileResponseSchema(MemberProfileCreateSchema):
    id: UUID
    member_id: UUID
    age: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True        