from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from db.Database import get_db
from models.models import User
from routers.oauth2 import get_current_user
from schemas import DemandeAdmissionUser as DemandeAdminitionSchema
from methods.DemandeAdmissionUser import (
    create_demande_adminition,
    Add_user_by_demande_adminition,
    get_all_demande_adminitions,
    update_demande_adminition,
    delete_demande_adminition,
)

router = APIRouter(
    tags=['DemandeAdmissionUser'],
    prefix='/DemandeAdmissionUser',
)

# Crée une demande d'admission
@router.post("/createDemande/")
def Create_demande_adminition(
    demande: DemandeAdminitionSchema.DemandeAdminitionCreate, db: Session = Depends(get_db)
):
    return create_demande_adminition(db, demande)

# Ajoute un utilisateur à une demande d'admission spécifique
@router.get("/GetDemandeadmissionUser/{demande_id}")
def AddUserByDemandeAdminition(demande_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return Add_user_by_demande_adminition(db, demande_id, current_user=current_user)

# Récupère toutes les demandes d'admission
@router.get("/GetAlldemandesAdmission/", response_model=List[DemandeAdminitionSchema.DemandeAdminition])
def read_all_demande_adminitions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_all_demande_adminitions(db=db, current_user=current_user)

# Met à jour une demande d'admission
@router.put("/UpdateDemandeAdmission/")
def Update_demande_adminition(demande: DemandeAdminitionSchema.DemandeAdminitionUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return update_demande_adminition(db, demande, current_user=current_user)

# Supprime une demande d'admission
@router.delete("/DeleteDemandeAdmission/{demande_id}")
def Delete_demande_adminition(demande_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return delete_demande_adminition(db, demande_id, current_user=current_user)
