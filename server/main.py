from typing import List
from fastapi import FastAPI, HTTPException, status, Depends
from models import ReturnedSessions, SessionTimeline, UserLogin, UserResponse, UserSignup
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from db import sessions_collection, users_collection
from services.gemini_service import generate_summary
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
import jwt
from datetime import datetime, timedelta
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


security = HTTPBearer()


def create_access_token(email: str):
    """Create a JWT token"""
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": email,
        "exp": expire
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token and return user"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/analyse")
async def create_session(session: SessionTimeline, user = Depends(verify_token)):
    try:
        session_data = session.model_dump()

        summary = generate_summary(session_data)
        
        session_data["summary"] = summary
        session_data["user_email"] = user["email"]

        result = sessions_collection.insert_one(session_data)
        session_data["_id"] = str(result.inserted_id)

        return session_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/sessions", response_model=List[ReturnedSessions])
def get_sessions(user = Depends(verify_token)):
    try:
        sessions = list(sessions_collection.find({"user_email": user["email"]}))

        for session in sessions:
            session["_id"] = str(session["_id"])
        
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/signup", response_model=UserResponse)
def signup(user: UserSignup):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    users_collection.insert_one({
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password
    })
    
    return UserResponse(
        email=user.email,
        full_name=user.full_name,
        message="User created successfully"
    )


@app.post("/login")
def login(user: UserLogin):
    # Find user
    db_user = users_collection.find_one({"email": user.email})
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check password
    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create token
    access_token = create_access_token(db_user["email"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": db_user["email"],
        "full_name": db_user["full_name"]
    }