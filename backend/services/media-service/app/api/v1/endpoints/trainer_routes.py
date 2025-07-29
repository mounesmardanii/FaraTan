from typing import Annotated
from loguru import logger
from fastapi import APIRouter, Depends, UploadFile, status, Form, HTTPException
from fastapi.responses import StreamingResponse
from bson import ObjectId
from fastapi.responses import Response

from app.domain.schemas.media_schema import MediaGetSchema, MediaSchema
from app.services.media_service import MediaService
from uuid import UUID
from app.validator.validator import validate_image_file
from app.services.trainer_service import TrainerService
from app.domain.schemas.trainer_schema import TrainerUpdateSchema

from app.services.auth_services.admin_auth_service import get_current_admin
from app.domain.schemas.token_schema import AdminTokenDataSchema

trainer_media_router = APIRouter()

@trainer_media_router.put(
    "/upload_profile",
    response_model=MediaSchema,
    status_code=status.HTTP_201_CREATED
)
async def upload_profile(
    trainer_id: UUID,
    file: UploadFile,
    media_service: Annotated[MediaService, Depends()],
    service: Annotated[TrainerService, Depends()],
    current_admin: Annotated[AdminTokenDataSchema, Depends(get_current_admin)],
):
    
    logger.info(f"Validating profile file")
    validate_image_file(file) 

    logger.info(f"Uploading profile for trainer {trainer_id} {file.filename}")
    output = await media_service.create_media(file, str(trainer_id))

    update_data = TrainerUpdateSchema(
        profile_image=str(output.mongo_id)
    )
    logger.info(f"Saving media in trainer with id: {trainer_id}")
    await service.update_trainer(trainer_id, update_data)
    
    return output



@trainer_media_router.get(
    "/get-profile/{trainer_id}",
    response_class=StreamingResponse,
    status_code=status.HTTP_200_OK
)
async def get_profile(
    trainer_id: UUID,
    media_service: Annotated[MediaService, Depends()],
    service: Annotated[TrainerService, Depends()],
):
    logger.info(f"Getting trainer info for trainer: {trainer_id}")

    try:
        trainer = await service.get_trainer_by_id(trainer_id)

        if not trainer.profile_image:
            logger.info(f"trainer {trainer_id} has no profile image.")
            return Response(status_code=204)

        mongo_id = ObjectId(trainer.profile_image)
        logger.info(f"Mongo ID for profile image: {mongo_id}")

        media_schema, file_stream = await media_service.get_public_media(mongo_id)

        if not (media_schema and file_stream):
            logger.warning(f"No media or file stream found for profile {mongo_id}")
            return Response(status_code=204)

        logger.info(f"Retrieving profile file: {media_schema.filename}")

        return StreamingResponse(
            content=file_stream(),
            media_type=media_schema.content_type,
            headers={
                "Content-Disposition": f"inline; filename={media_schema.filename}"
            },
        )

    except Exception as e:
        logger.warning(f"[Media Fetch Error] Profile image for trainer {trainer_id} failed: {e}")
        return Response(status_code=204)
