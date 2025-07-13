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



class MemberProfileBaseSchema(BaseModel):
    height: Optional[float] = None
    gender: Optional[str] = None
    birthdate: Optional[date] = None
    health_conditions: Optional[str] = None
    fitness_goals: Optional[str] = None


class MemberProfileCreateSchema(MemberProfileBaseSchema):
    pass


class MemberProfileUpdateSchema(MemberProfileBaseSchema):
    pass

class MemberProfileResponseSchema(MemberProfileBaseSchema):
    id: UUID
    member_id: UUID
    age: int
    class Config:
        from_attributes = True


class BodyMeasurementBaseSchema(BaseModel):
    weight: Optional[float] = None
    waist_circumference: Optional[float] = None
    hip_circumference: Optional[float] = None
    arm_circumference: Optional[float] = None
    chest_circumference: Optional[float] = None
    thigh_circumference: Optional[float] = None

class BodyMeasurementCreateSchema(BodyMeasurementBaseSchema):
    pass

class BodyMeasurementResponseSchema(BodyMeasurementBaseSchema):
    id: UUID
    member_id: UUID
    bmi: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BodyMeasurementUpdateSchema(BaseModel):
    weight: Optional[float] = None
    waist_circumference: Optional[float] = None
    hip_circumference: Optional[float] = None
    arm_circumference: Optional[float] = None
    chest_circumference: Optional[float] = None
    thigh_circumference: Optional[float] = None
