from typing import List
from fastapi import FastAPI, HTTPException, status, Depends, APIRouter
from models import ReturnedSessions, SessionTimeline, UserLogin, UserResponse, UserSignup
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from db import sessions_collection, users_collection
from services.gemini_service import generate_summary
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
import jwt
from datetime import datetime, timedelta
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from services.auth_util import verify_token, verify_token_optional
from services.cache_service import get_user_sessions, invalidate_user_sessions


router = APIRouter(
    tags=["Sessions"]
)


@router.post("/analyse")
async def create_session(session: SessionTimeline, user = Depends(verify_token_optional)):
    try:
        session_data = session.model_dump()

        summary = generate_summary(session_data)
        session_data["summary"] = summary

        if user:
            session_data["user_email"] = user["email"]

            result = sessions_collection.insert_one(session_data)
            session_data["_id"] = str(result.inserted_id)

            invalidate_user_sessions(user["email"])

        return session_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/sessions", response_model=List[ReturnedSessions])
def get_sessions(user = Depends(verify_token)):
    try:
        sessions = get_user_sessions(user["email"])
        return sessions
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))