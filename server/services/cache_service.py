from redis_conn.redis_client import redis_client
from db import sessions_collection
from bson import json_util

CACHE_TTL = 600

def get_user_sessions(user_email: str):
    key = f"user_sessions:{user_email}"

    cached = redis_client.get(key)
    if cached:
        sessions = json_util.loads(cached)
        return sessions

    sessions = list(sessions_collection.find({"user_email": user_email}))
    
    for session in sessions:
        session["_id"] = str(session["_id"])

    redis_client.setex(key, CACHE_TTL, json_util.dumps(sessions))
    
    return sessions

def invalidate_user_sessions(user_email: str):
    redis_client.delete(f"user_sessions:{user_email}")
