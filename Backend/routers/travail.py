from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from methods import travail as travailMethods
from db.Database import get_db
from routers.oauth2 import get_current_user
from models.models import User
from schemas import siege_service_poste as schemas

# Création d'un routeur API pour gérer les opérations liées au travail
router = APIRouter(
    prefix="/travail",
    tags=['travails']
)


# Endpoint pour créer une entite travail pour l'utilisateur
@router.post("/create/", response_model=schemas.Travail)
def Create_Travail(
    travail: schemas.TravailCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    return travailMethods.create_Travail(db, travail, current_user)

# Endpoint pour lire un service de siège de poste utilisateur par ID
@router.get("/get-ids/{travail_id}", response_model=schemas.Travail)
def Read_Travail_by_ids(travail_id: int, db: Session = Depends(get_db)):
    return travailMethods.read_Travail_by_ids(db, travail_id)


# endpoint pour recuper les jobs current  de user
@router.get("/JobsUser/", response_model=List[schemas.TravailNames])
def Get_current_user_jobs(current_user: User = Depends(get_current_user),
                       db:Session = Depends(get_db)):
    
    return  travailMethods.get_current_user_jobs(db=db , id_user = current_user.IDUser ,current_user=current_user)

# Endpoint pour recupere tous les job d'un utilisateur par son id 
@router.get("/Alljobs/{IDUser}",response_model=List[schemas.TravailNames])
def Get_all_user_jobs(IDUser :int, db: Session = Depends(get_db),current_user:User= Depends(get_current_user)):   
    return travailMethods.get_all_user_jobs(db=db, id_user=IDUser,current_user =current_user)

# Endpoint pour lire un service de siège de poste utilisateur par nom
@router.get("/names/{travail_id}", response_model=schemas.TravailNames)
def Read_Travail_names(travail_id: int, db: Session = Depends(get_db)):
    return travailMethods.read_Travail_by_names(db, travail_id)

# Endpoint pour mettre à jour un service de siège de poste utilisateur par ID
# response_model=schemas.ServiceSiegePosteUser
@router.put("/update/")
def Update_service_siege_poste_user(
    travail: schemas.Update, 
    db: Session = Depends(get_db) ,
    current_user:User =Depends(get_current_user)
):

    return travailMethods.update_Travail(db,travail,current_user)

# Endpoint pour supprimer un service de siège de poste utilisateur par ID
@router.delete("/delete/{travail_id}")
def Delete_Travail(
    travail_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return travailMethods.delete_Travail(db,travail_id, current_user)
