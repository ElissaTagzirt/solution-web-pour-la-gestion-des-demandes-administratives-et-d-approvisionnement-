from jose import JWTError, jwt
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from methods.user import get_user_by_email
from db.Database import get_db
from fastapi.security import (
    OAuth2PasswordBearer, 
)

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        useremail: str = payload.get("sub")
        if useremail is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    user = get_user_by_email(db, useremail)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user












def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
     payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
     user_email: int = payload.get("sub")
     if user_email is None:
        raise credentials_exception
    except JWTError as e:
     print("JWT Decode Error:", str(e))
     raise credentials_exception

    user = get_user_by_email(db, user_email)
    if user is None:
        raise credentials_exception
    return user

