from pydantic import BaseModel
from datetime import date
from uuid import UUID
from typing import Optional




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
    profile_image: Optional[str]    
    class Config:
        from_attributes = True 



class TrainerUpdateSchema(BaseModel):
    profile_image: str    