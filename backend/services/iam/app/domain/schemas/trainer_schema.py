from pydantic import BaseModel
from datetime import date
from uuid import UUID

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