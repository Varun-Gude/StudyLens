from pydantic import BaseModel
from datetime import datetime

class BookmarkCreate(BaseModel):
    topic: str

class BookmarkResponse(BaseModel):
    id: int
    topic: str
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
