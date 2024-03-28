from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from models import models
from schemas import outil as OutilSchema


def clean_string(s: str) -> str:
   # return re.sub(r'[-_]', '', s).upper()
   return s.upper()
def create_outil(request: OutilSchema.Outil, db: Session , current_user:models.User):
    if current_user.typeUser != True :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Action non autorisée")
    existing_outil = db.query(models.Outil).filter(models.Outil.NomOutil == request.NomOutil.upper()).first()
    if existing_outil:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cet outil existe déjà")
    
    new_outil = models.Outil(NomOutil=request.NomOutil.upper(), Description=request.Description)
    db.add(new_outil)
    db.commit()
    return  {"message":"Outil ajouter"}



def get_all_outils(db: Session,current_user:models.User) -> List[models.Outil]:
    if not current_user :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Action non autorisée") 
    return db.query(models.Outil).all()

def update_outil(db: Session, outil_id: int, updated_outil: OutilSchema.Outil , current_user:models.User):
    if current_user.typeUser != True :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Action non autorisée")
    db_outil = db.query(models.Outil).filter(models.Outil.IDOutil == outil_id).first()
    if db_outil is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outil non trouvé")
    
    
    if updated_outil.NomOutil != '' :
        db_outil.NomOutil = updated_outil.NomOutil 
        
    if updated_outil.Description != '' :
        db_outil.Description = updated_outil.Description     
    
    
    db.commit()
    db.refresh(db_outil)
    return {"message":"Updated"}

def delete_outil(db: Session, outil_id: int, current_user:models.User):
    if current_user.typeUser != True :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Action non autorisée")
    db_outil = db.query(models.Outil).filter(models.Outil.IDOutil == outil_id).first()
    if db_outil is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outil non trouvé")
    
    db.delete(db_outil)
    db.commit()
    return {"message":"outil supprimer"}


def get_outil_by_name(db: Session, outil_name: str , current_user:models.User):
    if current_user.typeUser != True :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Action non autorisée")
    cleaned_name = clean_string(outil_name)
    outil = db.query(models.Outil).filter(models.Outil.NomOutil == cleaned_name).first()
    if outil is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outil non trouvé")
    return outil
