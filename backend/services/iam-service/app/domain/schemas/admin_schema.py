from pydantic import BaseModel
from uuid import UUID


class AdminResponseSchema(BaseModel):
    admin_id:UUID
    phone_number: str
    can_reset_password: bool

    class Config:
        from_attributes=True

class SendOTPSchema(BaseModel):
    phone_number: str

class SendOTPResponseSchema(BaseModel):
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


class VerifyOTPSchema(BaseModel):
    phone_number: str
    otp: str
    class config:
        from_attributes=True

class VerifyOTPResponseSchema(BaseModel):
    verified: bool
    message: str    