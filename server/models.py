from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class SessionTimeline(BaseModel):
    timeStarted: datetime
    timeEnded: datetime
    touchedFace: List[datetime]
    distracted: List[List[datetime]]
    breaks: List[List[datetime]]
    summary: Optional[List[str]] = None