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
from app.services.member_service import MemberService
from app.domain.schemas.member_schema import MemberUpdateSchema

from app.services.auth_services.member_auth_service import get_current_member
from app.domain.schemas.token_schema import MemberTokenDataSchema

member_media_router = APIRouter()

@member_media_router.put(
    "/upload_profile",
    response_model=MediaSchema,
    status_code=status.HTTP_201_CREATED
)
async def upload_profile(
    file: UploadFile,
    media_service: Annotated[MediaService, Depends()],
    service: Annotated[MemberService, Depends()],
    current_member: Annotated[MemberTokenDataSchema, Depends(get_current_member)],
):
    
    logger.info(f"Validating profile file")
    validate_image_file(file) 

    logger.info(f"Uploading profile for member {current_member.id} {file.filename}")
    output = await media_service.create_media(file, str(current_member.id))

    update_data = MemberUpdateSchema(
        profile_image=str(output.mongo_id)
    )
    logger.info(f"Saving media in website with id: {current_member.id}")
    await service.update_member(current_member.id, update_data)
    
    return output



@member_media_router.get(
    "/get-profile/{member_id}",
    response_class=StreamingResponse,
    status_code=status.HTTP_200_OK
)
async def get_profile(
    member_id: UUID,
    media_service: Annotated[MediaService, Depends()],
    service: Annotated[MemberService, Depends()],
):
    logger.info(f"Getting member info for member: {member_id}")

    try:
        member = await service.get_member_by_id(member_id)

        if not member.profile_image:
            logger.info(f"Member {member_id} has no profile image.")
            return Response(status_code=204)

        mongo_id = ObjectId(member.profile_image)
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
        logger.warning(f"[Media Fetch Error] Profile image for member {member_id} failed: {e}")
        return Response(status_code=204)
