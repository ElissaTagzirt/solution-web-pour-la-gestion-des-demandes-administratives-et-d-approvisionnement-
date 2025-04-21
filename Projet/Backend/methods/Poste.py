from models import models
from schemas import siege_service_poste as poste
from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status
from typing import List




def clean_string(s: str) -> str:
   # return re.sub(r'[-_]', '', s).upper()
   return s.upper()
def create(request: poste.Poste, db: Session , current_user : models.User):
    #verifie d'abord que l'utilsateur connecte est véritablement un admin
    if current_user.typeUser == False : 
       return {"detail":"Vous n'êtes pas autorisé  à effectuer cette action."}
        
    # Vérifier l'existence du Poste par son nom
    
    existing_poste = db.query(models.Poste).filter(models.Poste.NomPoste == request.NomPoste.upper()).first()
    if existing_poste:
        return {"detail":"Le nom de poste que vous avez saisi existe déjà"}
    new_Poste = models.Poste(NomPoste=request.NomPoste.upper(), Description=request.Description)
    db.add(new_Poste)
    db.commit()
    db.refresh(new_Poste) # Créer un objet ShowPoste à partir de l'objet new_poste
    return new_Poste


def get_all_postes(db: Session , current_user : models.User) -> List[models.Poste]:
    #verifie d'abord que l'utilsateur connecte est véritablement un admin
    if not current_user : 
        raise HTTPException(status_code=400, detail="Vous n'êtes pas autorisé à effectuer cette action.")
    
    return db.query(models.Poste).all()
   

def update_poste(db: Session, poste_id: int, updatedposte: poste.UpdatePoste , current_user : models.User):
    #verifie d'abord que l'utilsateur connecte est véritablement un admin
    if current_user.typeUser == False : 
        raise HTTPException(status_code=400, detail="Vous n'êtes pas autorisé à effectuer cette action.")
    
    db_poste = db.query(models.Poste).filter(models.Poste.IDPoste == poste_id).first()
    if db_poste is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Poste non trouvé")
    
    
    
    if updatedposte.Description != '':
      db_poste.Description = updatedposte.Description
     
    if updatedposte.NomPoste != '': 
         db_sv = db.query(models.Poste).filter(models.Poste.NomPoste == updatedposte.NomPoste.upper()).first()
         if db_sv :
           raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ce siege existe déja")  
         else :
           db_poste.NomPoste = updatedposte.NomPoste
    db.commit()
    db.refresh(db_poste)
    return "updated"

def delete_poste(db: Session, poste_id: int , current_user : models.User):
    #verifie d'abord que l'utilsateur connecte est véritablement un admin
    if current_user.typeUser == False : 
        raise HTTPException(status_code=400, detail="Vous n'êtes pas autorisé à effectuer cette action.")
    
    db_poste = db.query(models.Poste).filter(models.Poste.IDPoste == poste_id).first()
    if db_poste is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Poste non trouvé")
    db.delete(db_poste)
    db.commit()
    return db_poste
