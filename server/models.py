from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class SessionTimeline(BaseModel):
    timeStarted: datetime
    timeEnded: datetime
    touchedFace: Optional[List[datetime]] = None
    distracted: Optional[List[List[datetime]]] = None
    breaks: Optional[List[List[datetime]]] = None
    score: int
    xp: Optional[int] = None
    summary: Optional[List[str]] = None


class ReturnedSessions(BaseModel):
    id: str = Field(alias="_id")
    timeStarted: datetime
    timeEnded: datetime
    touchedFace: Optional[List[datetime]] = None
    distracted: Optional[List[List[datetime]]] = None
    breaks: Optional[List[List[datetime]]] = None
    score: int
    xp: Optional[int] = None
    summary: Optional[List[str]] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    email: str
    name: str
    message: str