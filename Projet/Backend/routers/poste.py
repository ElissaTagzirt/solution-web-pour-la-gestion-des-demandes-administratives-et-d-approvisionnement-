from fastapi import APIRouter, Depends, HTTPException
from db import Database
from models import models
from schemas import siege_service_poste as poste
from sqlalchemy.orm import Session
from typing import List
from methods import Poste as PosteMethods
from db.Database import get_db
from routers.oauth2 import get_current_user


router = APIRouter(
    prefix='/poste',
    tags=['Postes']
)
get_db = Database.get_db

@router.get('/All-poste/', response_model=List[poste.ShowPoste])
def get_all_postes(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):  
    return PosteMethods.get_all_postes(db=db, current_user=current_user)

@router.post('/Add-poste/')
def create_poste(request: poste.Poste, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return PosteMethods.create(request=request, db=db, current_user=current_user)

@router.put('/update/{poste_id}/')
def update_poste(poste_id: int, updated_poste: poste.UpdatePoste, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return PosteMethods.update_poste(db=db, poste_id=poste_id, updatedposte=updated_poste, current_user=current_user)

@router.delete('delete/{poste_id}/', response_model=poste.ShowPoste)
def delete_poste(poste_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return PosteMethods.delete_poste(db=db, poste_id=poste_id, current_user=current_user)
