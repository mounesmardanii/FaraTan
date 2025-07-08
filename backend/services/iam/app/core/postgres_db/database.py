from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from loguru import logger

# DATABASE_URL = "postgresql://postgres:admin@postgres_container:5432/shopifygym_system"
DATABASE_URL = "postgresql://postgres:admin@localhost:5432/gym_system"

engine = create_engine(DATABASE_URL, future=True)
session_local = sessionmaker(autoflush=False, autocommit=False, bind=engine)

Base = declarative_base()


def init_db() -> bool:
    Base.metadata.create_all(bind=engine)
    logger.info("Database Initialized")
    return True


def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()
