from pydantic import BaseModel, ConfigDict, StringConstraints
from datetime import date, datetime
from typing import Optional
from uuid import UUID
from typing import Annotated

class MemberCreateSchema(BaseModel):
    full_name: str  
    phone_number: str 
    birthdate :date
    health_conditions :str
    fitness_goals : str
    class Config:
        from_attributes = True


class MemberResponseSchema(BaseModel):
    id: UUID
    full_name: str
    phone_number: str
    birthdate :date
    health_conditions :str
    fitness_goals : str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class UpdateMemberInfoSchema(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    birthdate :Optional[date]= None
    health_conditions :Optional[str]= None
    fitness_goals : Optional[str]= None

    class Config:
        from_attributes = True
