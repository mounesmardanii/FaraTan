from pydantic import BaseModel

class LoginSchema(BaseModel):
    phone_number: str
    password: str