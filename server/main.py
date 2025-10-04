from typing import Union
from fastapi import FastAPI
from models import SessionTimeline
from services.gemini_service import generate_summary

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/analyse")
def analyse(session: SessionTimeline):

    session_data = session.model_dump()

    summary = generate_summary(session_data)

    session_data["summary"] = summary

    return session_data