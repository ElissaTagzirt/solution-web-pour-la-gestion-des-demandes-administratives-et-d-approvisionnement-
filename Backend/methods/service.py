from models import models
from schemas import siege_service_poste as service
from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status
from typing import List
from models.models import User

def clean_string(s: str) -> str:
    return s.upper()

def create_service(request: service.Service, db: Session , current_user:models.User):
    # Vérifier l'existence du service par son nom
    if current_user.typeUser == False : 
        return {"detail":"Vous n'êtes pas autorisé  à effectuer cette action."}
        
    existing_service = db.query(models.Service).filter(models.Service.NomService == request.NomService.upper()).first()
    if existing_service:
        return {"detail":"Le nom de service que vous avez saisi existe déjà"}
    new_service = models.Service(NomService=request.NomService.upper(), Description=request.Description)
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

def get_all_services(db: Session , current_user:User) -> List[models.Service]:
    if not current_user : 
        raise HTTPException(status_code=401, detail="Vous n'êtes pas autorisé à effectuer cette action.")
    services = db.query(models.Service).all()
    return services

def update_service(db: Session, service_id: int, updatedservice: service.UpdateService, current_user:models.User):
    
    if current_user.typeUser == False : 
        raise HTTPException(status_code=401, detail="Vous n'êtes pas autorisé à effectuer cette action.")
    
    db_service = db.query(models.Service).filter(models.Service.IDService == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service non trouvé")
    
    if updatedservice.Description !='':
     db_service.Description = updatedservice.Description
     
    if updatedservice.NomService != '': 
         db_sv = db.query(models.Service).filter(models.Service.NomService == updatedservice.NomService.upper()).first()
         if db_sv :
           raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ce service existe déja")  
         else :
           db_service.NomService = updatedservice.NomService     
    db.commit()
    db.refresh(db_service)
    return "updated"

def delete_service(db: Session, service_id: int , current_user:models.User):
  
    if current_user.typeUser == False : 
        raise HTTPException(status_code=401, detail="Vous n'êtes pas autorisé à effectuer cette action.")
    
    db_service = db.query(models.Service).filter(models.Service.IDService == service_id).first()
    
    if db_service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service non trouvé")
    
    db.delete(db_service)
    db.commit()
    return "Service supprimé avec succès"
