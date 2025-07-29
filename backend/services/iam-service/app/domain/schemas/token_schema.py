from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional


class TokenSchema(BaseModel):
    access_token: str
    token_type: str


class TokenDataSchema(BaseModel):
    phone_number: Optional[str] = None


    