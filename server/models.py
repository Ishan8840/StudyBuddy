from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class SessionTimeline(BaseModel):
    timeStarted: datetime
    timeEnded: datetime
    touchedFace: List[datetime]
    distracted: List[List[datetime]]
    breaks: List[List[datetime]]
    summary: Optional[List[str]] = None


class ReturnedSessions(BaseModel):
    id: str = Field(alias="_id")
    timeStarted: datetime
    timeEnded: datetime
    touchedFace: List[datetime]
    distracted: List[List[datetime]]
    breaks: List[List[datetime]]
    summary: Optional[List[str]] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}