import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    force=True,
)

logger = logging.getLogger(__name__)
logger.info("Custom logging is configured.")
import smtplib
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from app.api.v1.endpoints.member_route import member_router
from app.api.v1.endpoints.admin_route import admin_router
from app.utils.scheduler_starter import starter

app = FastAPI()

@app.on_event("startup")
async def start_scheduler():
    starter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.info("IAM Service Started")

app.include_router(member_router, prefix="/api/v1/members", tags=["members"])
app.include_router(admin_router, prefix="/api/v1/admins", tags=["admins"])


@app.get("/")
async def root():
    return {"message": "Hello Dear! Welcome to the IAM service."}

