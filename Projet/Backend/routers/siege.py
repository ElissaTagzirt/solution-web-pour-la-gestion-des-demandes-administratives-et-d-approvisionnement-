from fastapi import APIRouter,Depends,HTTPException,status
from db import Database
from models import models
from schemas import siege_service_poste as siege
from sqlalchemy.orm import Session
from typing import List
from methods import siege as SG
from routers.oauth2 import get_current_user

router = APIRouter(
    prefix='/siege',
    tags=['Sieges']
)
get_db=Database.get_db

@router.get('/All-Sieges/',response_model=List[siege.ShowSiegeUser])
def get_all_sieges(db: Session = Depends(get_db), current_user : models.User = Depends(get_current_user)) -> List[models.Siege]:
    return SG.get_all_sieges(db=db , current_user=current_user) 

@router.post('/create/')
def create_siege(request: siege.Siege, db: Session = Depends(get_db), current_user : models.User = Depends(get_current_user)):
  return  SG.create(request = request, db=db, current_user = current_user)
  

@router.put('/update/{siege_id}')
def update_siege(siege_id, updated_siege: siege.UpdateSiege, db: Session = Depends(get_db),current_user : models.User = Depends(get_current_user)):
    return SG.update_siege(db=db, siege_id=siege_id, updatedsiege=updated_siege,current_user = current_user)
  
@router.delete('/Delete/{siege_id}')
def delete_siege(siege_id: int , db: Session = Depends(get_db),current_user : models.User = Depends(get_current_user)):
    return SG.delete_siege(db=db , siege_id=siege_id,current_user = current_user)


