
from loguru import logger
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_DIALECT: str = "postgresql+psycopg2"
    DATABASE_HOSTNAME: str = "postgres_container"
    DATABASE_NAME: str = "gym_sysytem"
    DATABASE_PASSWORD: str = "admin"
    DATABASE_PORT: int = 5432
    DATABASE_USERNAME: str = "postgres"
    DEBUG_MODE: bool = False
    # REDIS_URL: str = "localhost"
    REDIS_URL: str = "redis"
    REDIS_PORT: int = 6379
    JWT_SECRET_KEY : str = "3ffdda4a51a141cff4485a36f9cd137287f2526c1edb8300cd678ab96a49d1bd"
    JWT_ALGORITHM : str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    OTP_EXPIRE_TIME: int = 3600
    ENABLE_OTP: bool = False
    KAVENEGAR_API_KEY: str = "486E624C2F6A4A4A726B6645324B6A74526645332F52666632673733623634527A79742F6C34373237576B3D"
    KAVENEGAR_SENDER: str = "2000660110"

@logger.catch
def get_settings():
    return Settings()