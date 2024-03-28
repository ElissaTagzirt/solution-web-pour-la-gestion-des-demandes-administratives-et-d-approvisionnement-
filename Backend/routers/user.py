from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import User,showuser, Token ,UsersForUser, ChangePasswordRequest , UpdateInfoUser , UserFilter
from methods.user import get_user_by_id, authenticate_user, create_access_token , change_password , update_user_info ,get_filter_users_for_user,  get_users_for_user
from . import oauth2 as o
from db import Database
from db.Database import get_db
from typing import List , Optional
from models.models import User as UserModel
from fastapi.responses import JSONResponse
# Création d'un routeur API
router = APIRouter(
    prefix='/users',
    tags=['Users']
)

# Récupérer la base de données
get_db = Database.get_db

# Route protégée pour obtenir les détails de l'utilisateur actuel
@router.get("/me", response_model=showuser)
async def read_users_me(current_user: UserModel = Depends(o.get_current_user)):
    return     showuser(
        IDUser = current_user.IDUser, 
        name = current_user.name ,
        email = current_user.email ,
        numeroDeTelephone= str(current_user.numeroDeTelephone),
        adresse= current_user.adresse ,
        typeUser=current_user.typeUser ,
        dateNaissance = current_user.dateNaissance,
         )
    

# Route pour obtenir les détails d'un utilisateur par ID
@router.get('/{user_id}', response_model=User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

# Cette route semble inutilisée, vous pouvez la supprimer
@router.post('/token', response_model=Token)
def login_for_access_token(email: str, password: str, db: Session = Depends(get_db)):
    user = authenticate_user(db=db, email=email, password=password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.IDUser})
    return Token(access_token=access_token, token_type="bearer")

#Route pour modifie le mot de passe
@router.post("/change-password/")
async def change_user_password(
    request: ChangePasswordRequest,
    current_user: UserModel = Depends(o.get_current_user),
    db: Session = Depends(get_db)
):
    
    # Mettez à jour le mot de passe de l'utilisateur avec le nouveau mot de passe
    updated_user = change_password(db=db,user_id= current_user.IDUser, current_password=request.current_password,new_password= request.new_password)
    
    return updated_user

#changer les information de l'utilisateur 
@router.put("/update-info/{user_id}")
def Update_user_info(user_id: int, updated_info: UpdateInfoUser, db: Session = Depends(get_db) , current_user: UserModel = Depends(o.get_current_user)):
    return update_user_info(user_id=user_id, updated_info=updated_info, db=db, current_user =current_user)
    
    
@router.get("/GetUserForUser/")
def Get_users_for_user (db:Session = Depends(get_db) , current_user : UserModel = Depends(o.get_current_user) ): 
    return get_users_for_user (db=db , current_user =current_user)

@router.get("/FilerUserForUser/{Mot}/{Siege}/{Service}/{Poste}", 
            response_model=List[UsersForUser]
            )
def Get_filter_users_for_user(Mot:str,
    Siege:str,
    Service:str,
    Poste:str, current_user : UserModel = Depends(o.get_current_user) ,db:Session = Depends(get_db) ): 
    filter = UserFilter(Mot = Mot, Siege =Siege ,Service =Service,Poste=Poste) 
    return get_filter_users_for_user(db=db ,filters=filter, current_user =current_user)

@router.get("/TypeUser/")
def Get_type_user(db:Session=Depends(get_db),current_user: UserModel = Depends(o.get_current_user)):
   user = db.query(UserModel).filter(UserModel.IDUser==current_user.IDUser).first()
   return user.typeUser