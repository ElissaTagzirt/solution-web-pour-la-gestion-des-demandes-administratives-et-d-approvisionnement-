from sqlalchemy.orm import Session
from models.models import Reponse as ReponseModel
from models.models import Demande as DemandeModel
from schemas import reponse as ReponseSchemas
from models.models import User
from fastapi import HTTPException , status
from methods.notification import create_notification
from schemas.notification import Notification
   
    
    
    
# Méthode pour créer une réponse
def create_response(db: Session, response: ReponseSchemas.ResponseCreate, current_user: User):
    
    demande = db.query(DemandeModel).filter(DemandeModel.IDDemande==response.IDDeamnde).first()
    if not demande :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="La demande selectionne n'existe plus dans la base de données")
    else :
        db_response = ReponseModel(Contenu=response.contenu, IDUser=current_user.IDUser, IDDemande=response.IDDeamnde)
        db.add(db_response)
        db.commit()
        db.refresh(db_response)
        notification_data = Notification(
            IDDemandeAssocie=demande.IDDemande,
            IDUserDestine=demande.destinataire_id,
            ContenuNotif=f"Vous avez reçu une nouvelle réponse à la demande numéro {demande.IDDemande} de la part de {demande.destinataire_email}."
        )

        create_notification(db, notification_data)
        return ReponseSchemas.ShowResponse(
            IDReponse=db_response.IDReponse,
            DateCreation=db_response.DateCreation ,
            Contenu=response.contenu,
        )    



# Méthode pour obtenir une réponse par son ID
def get_response_by_id(db: Session, demande_id: int, current_user: User):
   
    db_response = db.query(ReponseModel).filter(ReponseModel.IDDemande == demande_id).first()
    if db_response == None :
        return {"Contenu":"Cette demande ne possède pas encore de réponse."}
    
    demande = db.query(DemandeModel).filter(DemandeModel.IDDemande == demande_id).first()
    if current_user.typeUser == False and demande.createur_id !=  current_user.IDUser and demande.destinataire_id != current_user.IDUser :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Action non autorise")
    if db_response:
        response = ReponseSchemas.ShowResponse(
            IDReponse=db_response.IDReponse,
            DateCreation=db_response.DateCreation,
            Contenu = db_response.Contenu  )
        return response
    else :return None
        
    

# Méthode pour mettre à jour le contenu d'une réponse
def update_response(db: Session, response: ReponseSchemas.UpdateResponse, current_user: User):
   
    db_response = db.query(ReponseModel).filter(ReponseModel.IDReponse == response.IDResponse).first()
    if db_response and db_response.IDUser == current_user.IDUser:
        db_response.Contenu = response.contenu
        db.commit()
        db.refresh(db_response)
        updated_response = ReponseSchemas.ShowResponse(
            IDReponse=db_response.IDReponse,
            DateCreation=db_response.DateCreation,
            Contenu=response.contenu
        )
        demande = db.query(DemandeModel).filter(DemandeModel.IDDemande==db_response.IDDemande).first()
        notification_data = Notification(
        IDDemandeAssocie=demande.IDDemande,
        IDUserDestine=demande.destinataire_id,
        ContenuNotif=f"La réponse à votre demande numéro {demande.IDDemande} a été modifiée par {demande.destinataire_email}.")
        create_notification(db, notification_data)

        return updated_response
    else :
        return None
    




# Méthode pour supprimer une réponse
def delete_response(db: Session, response_id: int, current_user: User):
    if current_user.typeUser !=  True :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Vous n'avez pas le droit d'effectue cette action")
    
    db_response = db.query(ReponseModel).filter(ReponseModel.IDReponse == response_id).first()
    if db_response :
        db.delete(db_response)
        db.commit()
        return {"message": "Réponse supprimée avec succès"}
