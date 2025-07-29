from pydantic import BaseModel, ConfigDict, StringConstraints
from datetime import date, datetime
from typing import Optional
from uuid import UUID
from typing import Annotated

class MemberUpdateSchema(BaseModel):
    profile_image:str