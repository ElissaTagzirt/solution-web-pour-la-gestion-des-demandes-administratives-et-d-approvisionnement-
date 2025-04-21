from fastapi import APIRouter, Depends, HTTPException, status
from db import Database
from models import models
from schemas import outil as outil_schema
from sqlalchemy.orm import Session
from typing import List
from methods import outil as OutilMethods
from db.Database import get_db
from routers.oauth2 import get_current_user
from fastapi import Depends

router = APIRouter(
    prefix='/outil',
    tags=['Outils']
)


@router.get('/allOutils', response_model=List[outil_schema.ShowOutil])
def get_all_outils(db: Session = Depends(get_db) ,
                   current_user : models.User = Depends(get_current_user)
                   ) -> List[models.Outil]:
  return OutilMethods.get_all_outils(db=db,current_user=current_user)
  
@router.post('/create/')
def create_outil(request: outil_schema.Outil,current_user:models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return OutilMethods.create_outil(request=request, db=db , current_user=current_user)

@router.get('/Getname/{outil_name}/', response_model=outil_schema.ShowOutil)
def get_outil_by_name(outil_name: str, current_user:models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return OutilMethods.get_outil_by_name(db=db,current_user=current_user, outil_name=outil_name)

@router.put('/Update/{outil_id}')
def update_outil(outil_id:int, updated_outil: outil_schema.Outil, current_user:models.User = Depends(get_current_user) , db: Session = Depends(get_db)):
    return OutilMethods.update_outil(db=db, outil_id=outil_id,current_user=current_user, updated_outil=updated_outil)

@router.delete('/delete/{outil_id}')
def delete_outil(outil_id: int, current_user:models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return OutilMethods.delete_outil(db=db, outil_id=outil_id , current_user=current_user)
