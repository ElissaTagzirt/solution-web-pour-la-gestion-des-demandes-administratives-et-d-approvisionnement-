from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.models import User
from db.Database import get_db
from routers.oauth2 import get_current_user
from methods import Reponse as Reponsesmethods
from schemas import reponse as   ReponseSchemas

router = APIRouter(
    tags=['ReponseDemande'],
     prefix='/ReponseDemande',
)

# Endpoint pour créer une réponse
@router.post("/Create/", response_model=ReponseSchemas.ShowResponse)
def create_response_endpoint(
    response: ReponseSchemas.ResponseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return Reponsesmethods.create_response(db, response, current_user)

# Endpoint pour obtenir une réponse par son ID
@router.get("/GetResponse/{demande_id}/")
def get_response_by_id_endpoint(
    demande_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return Reponsesmethods.get_response_by_id(db, demande_id, current_user)

# Endpoint pour mettre à jour le contenu d'une réponse
@router.put("/UpdateResponse/")
def update_response_endpoint(
    response: ReponseSchemas.UpdateResponse,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return Reponsesmethods.update_response(db, response, current_user)

# Endpoint pour supprimer une réponse
@router.delete("/DeleteResponse/{response_id}/")
def delete_response_endpoint(
    response_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return Reponsesmethods.delete_response(db, response_id, current_user)
