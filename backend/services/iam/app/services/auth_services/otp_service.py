import random
from typing import Annotated
from loguru import logger
from fastapi import Depends
from redis import Redis
from app.services.auth_services.kavenegar_client import KavenegarOTPClient
from  app.core.redis.redis_client import get_redis_client
from  app.services.base_service import BaseService


class OTPService:
    def __init__(self,
                 client: Annotated[KavenegarOTPClient,Depends()] ,
                  redis_client: Annotated[Redis, Depends(get_redis_client)])-> None:
        super().__init__()
        self.client = client
        self.redis = redis_client
        self.ttl = 120  

    def generate_otp(self) -> str:
        return str(random.randint(100000, 999999))     

    def send_otp(self, phone: str) -> str:
        otp = self.generate_otp()
        self.redis.setex(phone, self.ttl, otp)
        self.client.send_otp(phone, otp)
        logger.info(f"OTP sent {otp}")
        return otp

    def verify_otp(self, phone: str, otp: str) -> bool:
        stored = self.redis.get(phone)
        return stored is not None and stored == otp

    def check_exist(self, phone: str) -> bool:
        return self.redis.get(phone) is not None
