from pydantic import BaseModel
from datetime import date
from uuid import UUID
from typing import Optional


class TrainerCreateSchema(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    specialty: str
    birth_date: date
    start_date: date


class TrainerResponseSchema(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    phone_number: str
    specialty: str
    birth_date: date
    start_date: date
    age: int
    years_of_experience: int

    class Config:
        from_attributes = True 



class TrainerUpdateSchema(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    specialty: Optional[str] = None
    birth_date: Optional[date] = None
    start_date: Optional[date] = None       