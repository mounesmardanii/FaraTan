from app.domain.schemas.nutrition_schema import(
CreateNutritionWeekSchema,
NutritionWeekResponseSchema,
CreateNutritionDaySchema,
UpdateNutritionDaySchema,
NutritionDayResponseSchema,
UpdateWeekTitleSchema,
NutritionWeekPlanResponseSchema,
NutritionDayPlanResponseSchema
)
from typing import Annotated, List
from loguru import logger
from fastapi import Depends, HTTPException
from uuid import UUID
from app.services.nutrition_service import NutritionService
from app.services.member_service import MemberService
from app.services.reservation_service import ReservationService
from app.services.plan_session_service import PlanSessionService

from datetime import datetime

class NutritionMainService:
    def __init__(self,
        service: Annotated[NutritionService, Depends()],
        member_service:  Annotated[MemberService, Depends()],
        reservation_service:  Annotated[ReservationService, Depends()],
        session_service:  Annotated[PlanSessionService, Depends()],

        ):
        self.service = service
        self.member_service = member_service
        self.reservation_service = reservation_service
        self.session_service = session_service

    async def create_week(self, data: CreateNutritionWeekSchema) -> NutritionWeekResponseSchema:
        return await self.service.create_week(data)

    async def get_weeks_by_member(self, member_id: UUID) -> List[NutritionWeekResponseSchema]:
        return await self.service.get_weeks_by_member(member_id)

    async def delete_week(self, week_id: UUID) -> None:
        return await self.service.delete_week(week_id)

    async def update_week_title(self, week_id: UUID, data: UpdateWeekTitleSchema):
        return await self.service.update_week_title(week_id, data.title)
    
    async def create_day(self, data: CreateNutritionDaySchema) -> NutritionDayResponseSchema:
        day = await self.service.create_day(data)
        return NutritionDayResponseSchema.from_orm(day)

    async def get_day(self, day_id: UUID) -> NutritionDayResponseSchema:
        day = await self.service.get_day_by_id(day_id)
        return NutritionDayResponseSchema.from_orm(day)

    async def update_day(self, day_id: UUID, data: UpdateNutritionDaySchema) -> NutritionDayResponseSchema:
        day = await self.service.update_day(day_id, data)
        return NutritionDayResponseSchema.from_orm(day)

    async def get_week_plan(self, week_id: UUID) -> NutritionWeekPlanResponseSchema:
        days = await self.service.get_week_plan(week_id)
        return NutritionWeekPlanResponseSchema(
            week_id=week_id,
            days=[NutritionDayPlanResponseSchema.from_orm(day) for day in days]
        )
    


    async def calculate_nutrition(self, member_id: UUID) -> dict:
        member = await self.member_service.get_member_profile(member_id)
        measurement = await self.member_service.get_latest_measurement(member_id)
        reservation = await self.reservation_service.get_last_reservation_by_member_id(member_id)
        if reservation:
            session = await self.session_service.get_by_id(reservation.session_id)
            session_count = session.session_count
        session_count = 0    
        if not (member and measurement):
            raise HTTPException(status_code=404, detail="Member or measurement not found")

        age = member.age
        weight = measurement.weight
        height = member.height
        gender = member.gender
        goal = member.fitness_goals or "maintain"

        if gender == "male":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161

        if session_count <= 3:
            multiplier = 1.2
            activity_level = "کم‌تحرک"
        elif session_count <= 8:
            multiplier = 1.375
            activity_level = "نیمه‌فعال"
        elif session_count <= 12:
            multiplier = 1.55
            activity_level = "فعال"
        else:
            multiplier = 1.725
            activity_level = "خیلی فعال"

        tdee = bmr * multiplier

        
        if goal == "lose":
            recommended = tdee - 400
        elif goal == "gain":
            recommended = tdee + 400
        else:
            recommended = tdee

        protein_grams = round(0.3 * recommended / 4)
        fat_grams = round(0.25 * recommended / 9)
        carbs_grams = round(0.45 * recommended / 4)
        sugar_grams = round(0.1 * recommended / 4)
        fiber_grams = 30
        water_liters = round(weight * 0.035, 1)

        return {
            "bmr": round(bmr),
            "tdee": round(tdee),
            "recommended_calories": round(recommended),
            "activity_level": activity_level,
            "session_count": session_count,
            "protein_grams": protein_grams,
            "fat_grams": fat_grams,
            "carbs_grams": carbs_grams,
            "sugar_grams": sugar_grams,
            "fiber_grams": fiber_grams,
            "water_liters": water_liters
        }