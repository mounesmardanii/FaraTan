
from fastapi import APIRouter, Depends
from typing import Annotated
from app.core.configs.config import Settings, get_settings

utility_router = APIRouter()

@utility_router.get("/otp-status")
def get_otp_status(config: Annotated[Settings, Depends(get_settings)]):
    return {f"{config.ENABLE_OTP}"}
