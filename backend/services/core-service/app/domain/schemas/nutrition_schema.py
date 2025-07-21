from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List
from typing import Optional

class CreateNutritionWeekSchema(BaseModel):
    member_id: UUID
    title: str

class NutritionWeekResponseSchema(BaseModel):
    id: UUID
    member_id: UUID
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MealInputSchema(BaseModel):
    meal_type: str
    meal_description: str

class UpdateWeekTitleSchema(BaseModel):
    title: str


class CreateNutritionDaySchema(BaseModel):
    week_id: UUID
    day_of_week: str
    breakfast: Optional[str] = None
    snack: Optional[List[str]] = None 
    lunch: Optional[str] = None
    dinner: Optional[str] = None

class UpdateNutritionDaySchema(BaseModel):
    breakfast: Optional[str] = None
    snack: Optional[List[str]] = None 
    lunch: Optional[str] = None
    dinner: Optional[str] = None

class NutritionDayResponseSchema(BaseModel):
    id: UUID
    week_id: UUID
    day_of_week: str
    breakfast: Optional[str]
    snack: Optional[List[str]] 
    lunch: Optional[str]
    dinner: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class NutritionDayPlanResponseSchema(BaseModel):
    id: UUID
    day_of_week: str
    breakfast: Optional[str]
    lunch: Optional[str]
    dinner: Optional[str]
    snack: Optional[List[str]]
    created_at: datetime

    class Config:
        from_attributes = True


class NutritionWeekPlanResponseSchema(BaseModel):
    week_id: UUID
    days: List[NutritionDayPlanResponseSchema]
