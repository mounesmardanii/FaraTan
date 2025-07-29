from typing import Annotated, Optional
from loguru import logger
from fastapi import APIRouter, Depends, UploadFile, status, Form, HTTPException, File
from fastapi.responses import StreamingResponse
from bson import ObjectId
from fastapi.responses import Response, JSONResponse

from app.domain.schemas.media_schema import MediaGetSchema, MediaSchema
from app.services.media_service import MediaService
from uuid import UUID
from app.validator.validator import validate_video_file
from app.services.trainer_service import TrainerService
from app.services.movement_service import MovementService
from app.services.auth_services.admin_auth_service import get_current_admin
from app.domain.schemas.token_schema import AdminTokenDataSchema

movement_media_router = APIRouter()

@movement_media_router.put(
    "/{movement_id}/upload_video",
    response_model=MediaSchema,
    status_code=status.HTTP_201_CREATED
)
async def upload_movement_video(
    movement_id: UUID,
    media_service: Annotated[MediaService, Depends()],
    service: Annotated[MovementService, Depends()],
    current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)],
    is_vip:Optional[bool]=None,
    file: Optional[UploadFile] = File(None),
):
    mongo_id = None
    media = None
    updated_fields = {}

    if file:
        validate_video_file(file)
        media = await media_service.create_media(file, str(movement_id))
        mongo_id = str(media.mongo_id)
        updated_fields["video_url"] = True

    if is_vip is not None:
        updated_fields["is_vip"] = is_vip

    await service.update_movement_video(
        movement_id=movement_id,
        mongo_id=mongo_id,
        is_vip=is_vip
    )

    return JSONResponse(
        status_code=200,
        content={
            "detail": "Movement updated successfully",
            "media": media.model_dump() if media else None,
            "updated_fields": updated_fields
        }
    )
