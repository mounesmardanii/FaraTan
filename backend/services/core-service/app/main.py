import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    force=True,
)

logger = logging.getLogger(__name__)
logger.info("Custom logging is configured.")
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
# from app.api.v1.endpoints.member_route import member_router
from app.api.v1.endpoints.admin_routes import admin_router
# from app.utils.scheduler_starter import starter
from app.api.v1.endpoints.nutrition_routes import nutrition_router
from app.api.v1.endpoints.plan_routes import plan_router
from app.api.v1.endpoints.plan_session_routes import plan_session_router
from app.api.v1.endpoints.payment_routes import payment_router
from app.api.v1.endpoints.purchase_routes import purchase_router
from app.api.v1.endpoints.schedule_routes import gym_schedule_router
from app.api.v1.endpoints.sports_routes import gym_sports_router
from app.api.v1.endpoints.reservation_routes import reservation_router
from app.api.v1.endpoints.movement_routes import movement_router
from app.api.v1.endpoints.program_routes import program_router


app = FastAPI()

# @app.on_event("startup")
# async def start_scheduler():
#     starter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.info("IAM Service Started")

# app.include_router(member_router, prefix="/api/v1/members", tags=["members"])
app.include_router(admin_router, prefix="/api/v1/admins", tags=["admins"])
app.include_router(nutrition_router, prefix="/api/v1/nutrition", tags=["nutritions"])
app.include_router(plan_router, prefix="/api/v1/plan", tags=["plans"])
app.include_router(plan_session_router, prefix="/api/v1/session", tags=["sessions"])
app.include_router(payment_router, prefix="/api/v1/payment", tags=["payments"])
app.include_router(purchase_router, prefix="/api/v1/purchase", tags=["purchases"])
app.include_router(gym_schedule_router, prefix="/api/v1/schedule", tags=["schedules"])
app.include_router(gym_sports_router, prefix="/api/v1/sport", tags=["sports"])
app.include_router(reservation_router, prefix="/api/v1/reservation", tags=["reservations"])
app.include_router(movement_router, prefix="/api/v1/movement", tags=["movements"])
app.include_router(program_router, prefix="/api/v1/program", tags=["programs"])


@app.get("/")
async def root():
    return {"message": "Hello Dear! Welcome to the Core service."}

