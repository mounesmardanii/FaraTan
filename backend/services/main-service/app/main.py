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
from app.api.v1.endpoints.admin_routes import admin_router
from app.api.v1.endpoints.nutrition_routes import nutrition_router
from app.api.v1.endpoints.plan_routes import plan_router
from app.api.v1.endpoints.purchase_routes import purchase_router
from app.api.v1.endpoints.member_route import member_router



app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.info("Service Started")

app.include_router(admin_router, prefix="/api/v1/admins", tags=["admins"])
app.include_router(nutrition_router, prefix="/api/v1/nutrition", tags=["nutritions"])
app.include_router(plan_router, prefix="/api/v1/plan", tags=["plans"])
app.include_router(purchase_router, prefix="/api/v1/purchase", tags=["purchases"])
app.include_router(member_router, prefix="/api/v1/members", tags=["members"])


@app.get("/")
async def root():
    return {"message": "Hello Dear! Welcome to the Faratan."}

