from fastapi import HTTPException, status, Depends, APIRouter
from models import UserLogin, UserResponse, UserSignup
from db import users_collection
import bcrypt
from services.auth_util import create_access_token


router = APIRouter(
    tags=["Auth"]
)


@router.post("/signup", response_model=UserResponse)
def signup(user: UserSignup):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    users_collection.insert_one({
        "email": user.email,
        "name": user.name,
        "hashed_password": hashed_password
    })
    
    return UserResponse(
        email=user.email,
        name=user.name,
        message="User created successfully"
    )


@router.post("/login")
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
        "name": db_user["name"]
    }