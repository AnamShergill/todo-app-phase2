from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional
import os

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "2df80a9a2e5581e96f8b45c0c57d9bb89ef0aab1cc1e075a98dfb2811a1c5bfc")  # Use SECRET_KEY environment variable
ALGORITHM = "HS256"

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    """
    Verify the JWT token and return the user ID.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Convert string user ID to integer
        user_id = int(user_id_str)
        return user_id
    except (JWTError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )