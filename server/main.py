from typing import List, Union
from fastapi import FastAPI, HTTPException
from models import ReturnedSessions, SessionTimeline
from db import sessions_collection
from services.gemini_service import generate_summary
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/analyse")
def create_session(session: SessionTimeline):
    try:
        session_data = session.model_dump()

        summary = generate_summary(session_data)
        
        session_data["summary"] = summary
        result = sessions_collection.insert_one(session_data)

        session_data["_id"] = str(result.inserted_id)

        return session_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/sessions", response_model=List[ReturnedSessions])
def get_sessions():
    try:
        sessions = list(sessions_collection.find())

        for session in sessions:
            session["_id"] = str(session["_id"])
        
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))