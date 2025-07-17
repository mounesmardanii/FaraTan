from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List

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

class CreateDayWithMealsSchema(BaseModel):
    week_id: UUID
    day_of_week: str
    meals: List[MealInputSchema]


class UpdateWeekTitleSchema(BaseModel):
    title: str


class NutritionMealResponseSchema(BaseModel):
    id: UUID
    meal_type: str
    meal_description: str
    created_at: datetime

    class Config:
        from_attributes = True    

class DayWithMealsResponseSchema(BaseModel):
    id: UUID
    week_id: UUID
    day_of_week: str
    meals: List[NutritionMealResponseSchema]

    class Config:
        from_attributes = True
