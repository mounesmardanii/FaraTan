from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import logging

from app.api.v1.endpoints.member_routes import member_media_router
from app.api.v1.endpoints.trainer_routes import trainer_media_router
from app.api.v1.endpoints.movement_routes import movement_media_router
from app.utils.scheduler_starter import starter
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    force=True,
)

logger = logging.getLogger(__name__)
logger.info("Custom logging is configured.")

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

app.include_router(member_media_router, prefix="/api/v1/member", tags=["member_media"])
app.include_router(trainer_media_router, prefix="/api/v1/trainer", tags=["trainer_media"])
app.include_router(movement_media_router, prefix="/api/v1/movement", tags=["movement_media"])

logger.info("Media Service Started")


@app.get("/")
async def root():
    return {"message": "Hello Dear! Welcome to Media Service."}
