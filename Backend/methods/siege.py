from models import models
from schemas import siege_service_poste as siege
from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status





def clean_string(s: str) -> str:
   # return re.sub(r'[-_]', '', s).upper()
   return s.upper()

def create(request: siege.Siege, db: Session , current_user : models.User):
    # Vérifier l'existence du siège par son nom
    if current_user.typeUser == False : 
        return {"detail":"Vous n'êtes pas autorisé  à effectuer cette action."}
        
    existing_siege = db.query(models.Siege).filter(models.Siege.NomSiege == request.NomSiege.upper()).first()
    if existing_siege:
       return {"detail":"Le nom de siège que vous avez saisi existe déjà"}
        
    new_siege = models.Siege(NomSiege=request.NomSiege.upper(), Description=request.Description)
    db.add(new_siege)
    db.commit()
    db.refresh(new_siege)
    return {"message":"Siège créé"}
    



def get_all_sieges(db: Session , current_user:models.User) -> List[models.Siege]:
    if not current_user : 
        raise HTTPException(status_code=400, detail="Vous n'êtes pas autorisé à effectuer cette action.")
    return db.query(models.Siege).all()


def update_siege(db: Session, siege_id: int, updatedsiege: siege.UpdateSiege , current_user: models.User):
    if current_user.typeUser == False : 
        raise HTTPException(status_code=400, detail="Vous n'êtes pas autorisé à effectuer cette action.")
    db_siege = db.query(models.Siege).filter(models.Siege.IDSiege == siege_id).first()
    if db_siege is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Siège non trouvé")
    if updatedsiege.Description != '' :
        db_siege.Description = updatedsiege.Description
    if updatedsiege.NomSiege != '' :
        db_sg = db.query(models.Siege).filter(models.Siege.NomSiege == updatedsiege.NomSiege.upper()).first()
        if db_sg :
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="le siege existe déja")
        else :
            db_siege.NomSiege = updatedsiege.NomSiege    
    
    db.commit()
    db.refresh(db_siege)
    return "updated"

def delete_siege(db: Session, siege_id: int , current_user : models.User):
    if current_user.typeUser == False : 
        raise HTTPException(status_code=401, detail="Vous n'êtes pas autorisé à effectuer cette action.")
    db_siege = db.query(models.Siege).filter(models.Siege.IDSiege == siege_id).first()
    if db_siege is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Siège non trouvé")
    db.delete(db_siege)
    db.commit()
