from typing import Union
from fastapi import FastAPI, HTTPException
from models import SessionTimeline
from db import sessions_collection
from services.gemini_service import generate_summary

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/analyse")
def analyse(session: SessionTimeline):
    try:

        session_data = session.model_dump()

        summary = generate_summary(session_data)

        session_data["summary"] = summary

        result = sessions_collection.insert_one(session_data)

        session_data["_id"] = str(result.inserted_id)

        return session_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/sessions")
def get_sessions():
    try:
        sessions = list(sessions_collection.find())

        for session in sessions:
            session["_id"] = str(session["_id"])
        
        return {"sessions": sessions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))