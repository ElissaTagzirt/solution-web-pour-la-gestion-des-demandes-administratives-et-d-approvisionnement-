# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import Token , UserLogin
from methods import user as US
from db.Database import get_db
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer



router = APIRouter(
    tags=['auth'])
# Le reste de votre code ...

@router.post('/login', response_model=Token)
def login_for_access_token_User(request : OAuth2PasswordRequestForm=Depends(), db: Session = Depends(get_db)):
    usr =  US.authenticate_user(email=request.username, password=request.password , db=db)
    if usr is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="prombleme Invalid credentials")
    access_token = US.create_access_token(data={"sub": usr.email})
    #rs = Token(access_token=access_token ,token_type="bearer")
    return  Token(access_token=access_token, token_type="bearer")


