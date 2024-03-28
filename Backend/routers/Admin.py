from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import UserFilter,User,UpdateUserType, userCreate, UserBase , showuser ,AdminCreate , Admin
from methods.user import change_Statue_User,delete_user, get_filter_users_for_admin ,update_user_info_admin, create_normale_user,create_admin_user_first,create_admin_user, get_user_by_id, get_all_users, authenticate_user, create_access_token 
from  . import oauth2 as o


from db import Database
from typing import List
from models.models import User as UserModel

router = APIRouter(
    prefix='/Admin',
    tags=['Admins']
)
get_db = Database.get_db

@router.post('/createUser')
def register_user(user: userCreate, db: Session = Depends(get_db),
                  current_user = Depends(o.get_current_user)):
    return create_normale_user(db=db, user=user,current_user=current_user)
     
@router.post('/createfirstAdmin')
def register_first_admin(admin: AdminCreate, db: Session = Depends(get_db),):
    db_admin = create_admin_user_first(db,admin)
    return db_admin


@router.post('/createAdmin', response_model=Admin)
def register_Admin(admin: AdminCreate, db: Session = Depends(get_db),
                  current_user = Depends(o.get_current_user)):
    db_admin = create_admin_user(db,admin,current_user=current_user)
    return db_admin

@router.get('/me', response_model=User)
def read_users_me(token: str = Depends(o.oauth2_scheme), db: Session = Depends(get_db)):
   return o.get_current_user(token=token, db=db)
register_user

@router.get('/Get_user/{user_id}', response_model=showuser)
def get_user(user_id: int, db: Session = Depends(get_db),
                  current_user = Depends(o.get_current_user)):
    db_user = get_user_by_id(db, user_id ,current_user=current_user)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

@router.get('/Get_users')
def Get_all_user(db: Session = Depends(get_db),
                  current_user = Depends(o.get_current_user)):
    users = get_all_users(db=db,current_user=current_user)
    return users

#changer les information de l'utilisateur 
@router.put("/update-info/{user_id}")
def Update_user_info(user_id: int, updated_info: UserBase, db: Session = Depends(get_db) , current_user: UserModel = Depends(o.get_current_user)):
    return update_user_info_admin(user_id=user_id, updated_info=updated_info, db=db, current_user =current_user)
    
@router.get("/FilerUserForAdmin/{Mot}/{Siege}/{Service}/{Poste}")
def Get_filter_users_for_admin (Mot:str,
    Siege:str,
    Service:str,
    Poste:str, current_user : UserModel = Depends(o.get_current_user) ,db:Session = Depends(get_db) ): 
    filter = UserFilter(Mot = Mot, Siege =Siege ,Service =Service,Poste=Poste) 
    return get_filter_users_for_admin(db=db ,filters=filter, current_user =current_user)

@router.put("/ChangeStatueUser/{IDUser}/")
def Change_Statue_User (IDuser:int , typeuser :UpdateUserType,db:Session = Depends(get_db),current_user :UserModel = Depends(o.get_current_user)):
  return change_Statue_User(IDuser=IDuser , type=typeuser.typeUser , db=db , current_user =current_user)


@router.delete("/delete_user/{user_id}", response_model=dict)
async def Delete_user(user_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(o.get_current_user)):
    return delete_user(user_id, db, current_user)
 