from fastapi import APIRouter, Depends, HTTPException
from db import Database
from models import models
from schemas import siege_service_poste as service
from sqlalchemy.orm import Session
from typing import List
from methods import service as SV
from routers.oauth2 import get_current_user

router = APIRouter(
    prefix='/service',
    tags=['Services']
)
get_db = Database.get_db

@router.get('/', response_model=List[service.ShowService])
def get_all_services(db: Session = Depends(get_db) , current_user : models.User = Depends(get_current_user)) -> List[models.Service]:
    return SV.get_all_services(db=db,current_user=current_user)



@router.post('/create/')
def create_service(request: service.Service, current_user : models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return SV.create_service(request=request, db=db , current_user = current_user)

    
@router.put('/Update/{service_id}')
def update_service(service_id: int, updated_service: service.UpdateService, db: Session = Depends(get_db) ,  current_user : models.User = Depends(get_current_user)):
    return SV.update_service(db=db, service_id=service_id,current_user=current_user, updatedservice=updated_service)

@router.delete('/delete/{service_id}')
def delete_service(service_id: int, db: Session = Depends(get_db),  current_user : models.User = Depends(get_current_user)):
    return SV.delete_service(db=db, service_id=service_id, current_user=current_user)
