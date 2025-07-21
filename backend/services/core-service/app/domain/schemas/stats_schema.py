from pydantic import BaseModel

class MemberGrowthStatSchema(BaseModel):
    month: str   
    member_count: int
