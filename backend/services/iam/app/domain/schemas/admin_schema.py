from pydantic import BaseModel


class AdminLoginSchema(BaseModel):
    phone_number: str
    password: str