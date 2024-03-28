from models import models
from schemas import siege_service_poste as schemas
from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status
from datetime import datetime as dt



def create_Travail(db: Session, service_siege_poste_user: schemas.TravailCreate , current_user:models.User):
    if current_user.typeUser == False : 
        raise HTTPException(status_code=400, detail="Vous n'êtes pas autorisé à effectuer cette action.")

    poste = db.query(models.Poste).filter(models.Poste.IDPoste == service_siege_poste_user.IDPoste).first()
    if not poste:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Le poste spécifié n'existe pas")

    # Vérifiez l'existence de IDSiege
    siege = db.query(models.Siege).filter(models.Siege.IDSiege == service_siege_poste_user.IDSiege).first()
    if not siege:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Le siège spécifié n'existe pas")

    # Vérifiez l'existence de IDService
    service = db.query(models.Service).filter(models.Service.IDService == service_siege_poste_user.IDService).first()
    if not service:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Le service spécifié n'existe pas")
    
    
    
    
    
    db_service_siege_poste_user = models.ServiceSiegePosteUser(
       IDService =  service_siege_poste_user.IDService,
       IDSiege   =  service_siege_poste_user.IDSiege  ,
       IDUser    =  service_siege_poste_user.IDUser ,
       IDPoste   =  service_siege_poste_user.IDPoste ,
       AnneeDebutTravail =service_siege_poste_user.AnneeDebutTravail
                    
    )
    db.add(db_service_siege_poste_user)
    db.commit()
    db.refresh(db_service_siege_poste_user)
    return schemas.Travail(
        IDRelation=db_service_siege_poste_user.IDRelation,
        IDService=db_service_siege_poste_user.IDService,
        IDSiege=db_service_siege_poste_user.IDSiege,
        IDUser=db_service_siege_poste_user.IDUser,
        IDPoste=db_service_siege_poste_user.IDPoste,
        AnneeFinTravail=(
            db_service_siege_poste_user.AnneeFinTravail.strftime("%Y-%m-%d")
            if db_service_siege_poste_user.AnneeFinTravail
            else None
        ),
        AnneeDebutTravail=db_service_siege_poste_user.AnneeDebutTravail.strftime("%Y-%m-%d") )

def read_Travail_by_ids(db: Session, travail_id: int):
    db_service_siege_poste_user=db.query(models.ServiceSiegePosteUser).filter(models.ServiceSiegePosteUser.IDRelation == travail_id).first()
    return schemas.Travail(
        IDRelation=db_service_siege_poste_user.IDRelation,
        IDService=db_service_siege_poste_user.IDService,
        IDSiege=db_service_siege_poste_user.IDSiege,
        IDUser=db_service_siege_poste_user.IDUser,
        IDPoste=db_service_siege_poste_user.IDPoste,
        AnneeFinTravail=(
            db_service_siege_poste_user.AnneeFinTravail.strftime("%Y-%m-%d")
            if db_service_siege_poste_user.AnneeFinTravail
            else None
        ),
        AnneeDebutTravail=db_service_siege_poste_user.AnneeDebutTravail.strftime("%Y-%m-%d") )
    
    
    
def read_Travail_by_names(db: Session, travail_id: int):
    travailler_db = db.query(models.ServiceSiegePosteUser).filter(models.ServiceSiegePosteUser.IDRelation == travail_id).first()
    if travailler_db is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cette entité n'existe pas")
    
    Nomservice = db.query(models.Service).filter(models.Service.IDService==travailler_db.IDService).first()
    Nomsiege = db.query(models.Siege).filter(models.Siege.IDSiege==travailler_db.IDSiege).first()
    Nomposte = db.query(models.Poste).filter(models.Poste.IDPoste==travailler_db.IDPoste).first()
    Nomuser = db.query(models.User).filter(models.User.IDUser== travailler_db.IDUser).first()
    return schemas.TravailNames(IDRelation = travailler_db.IDRelation,
                                                 NomService = Nomservice.NomService ,
                                                 NomSiege= Nomsiege.NomSiege ,
                                                 NomUser = Nomuser.name ,
                                                 NomPoste = Nomposte.NomPoste ,
                                                 AnneeFinTravail=(
                                                        travailler_db.AnneeFinTravail.strftime("%Y-%m-%d")
                                                        if travailler_db.AnneeFinTravail
                                                        else None
                                                ),
                                                AnneeDebutTravail=travailler_db.AnneeDebutTravail.strftime("%Y-%m-%d") )
    

def update_Travail(db: Session, s: schemas.Update, current_user: models.User):
    # Vérifiez d'abord l'existence de l'entité que vous souhaitez mettre à jour
    AnneeFinTravail: dt.date = s.datedepart
    
    sv = schemas.TravailUpdate( IDRelation = s.IDRelation , AnneeFinTravail = AnneeFinTravail   )
    
   
    service_siege_poste_user_id = sv.IDRelation
    db_service_siege_poste_user = db.query(models.ServiceSiegePosteUser).filter(models.ServiceSiegePosteUser.IDRelation == service_siege_poste_user_id).first()
    if not db_service_siege_poste_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="L'entité que vous voulez modifier n'existe pas")
    
    # Vérifiez si l'utilisateur actuel est autorisé à effectuer cette action
    if current_user.typeUser == False and db_service_siege_poste_user.IDUser != current_user.IDUser:
        raise HTTPException(status_code=400, detail="Vous n'êtes pas autorisé à effectuer cette action.")
    
    if   sv.AnneeFinTravail < db_service_siege_poste_user.AnneeDebutTravail :
        raise HTTPException(status_code=422,detail = f"La date {sv.AnneeFinTravail} est invalide pour cette action.")
      
    # Vérifiez l'existence de IDPoste
    """ if sv.IDPoste:
        poste = db.query(models.Poste).filter(models.Poste.IDPoste == sv.IDPoste).first()
        if not poste:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Le poste spécifié n'existe pas")

    # Vérifiez l'existence de IDSiege
    if sv.IDSiege:
        siege = db.query(models.Siege).filter(models.Siege.IDSiege == sv.IDSiege).first()
        if not siege:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Le siège spécifié n'existe pas")

    # Vérifiez l'existence de IDService
    if sv.IDService:
        service = db.query(models.Service).filter(models.Service.IDService == sv.IDService).first()
        if not service:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Le service spécifié n'existe pas")
    """
    # Mettez à jour les attributs
    for key, value in sv.dict().items():
        setattr(db_service_siege_poste_user, key, value)
    
    # Committez les changements
    db.commit()
    
    db.refresh(db_service_siege_poste_user)
    
    # Retournez l'entité mise à jour
    return {"message":"changement effectue"}
    

    
     
def delete_Travail(db: Session, travail_id: int , current_user : models.User):
    if  current_user.typeUser == False :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cette action n'est pas autorisée")
    
    db_service_siege_poste_user = db.query(models.ServiceSiegePosteUser).filter(models.ServiceSiegePosteUser.IDRelation == travail_id).first()
    if db_service_siege_poste_user:
        db.delete(db_service_siege_poste_user)
        db.commit()
        return{"message":"entité supprimée"} 
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="l'entite que vous voulliez suprrimer n'existe pas")
    

# recevoir tous les trvailles d'un utilisateur ce courant 
def get_current_user_jobs(db:Session , id_user: int ,current_user :models.User):
    if current_user.IDUser != id_user and current_user.typeUser == False :
        return None
    jobs = db.query(models.ServiceSiegePosteUser).filter(models.ServiceSiegePosteUser.IDUser==id_user ,
        models.ServiceSiegePosteUser.AnneeFinTravail.is_(None)).all()
    jobs_with_names =[]
    if  jobs : 
        for job in jobs :
            job_with_names = read_Travail_by_names(db=db,travail_id=job.IDRelation)
            jobs_with_names.append(job_with_names)
    return jobs_with_names

# recuper tout les postes d'un utilisateur 
def get_all_user_jobs(db:Session , id_user: int ,current_user :models.User):
    if current_user.IDUser != id_user and current_user.typeUser == False :
        return None
    jobs = db.query(models.ServiceSiegePosteUser).filter(models.ServiceSiegePosteUser.IDUser==id_user).all()
    jobs_with_names =[]
    if  jobs : 
        for job in jobs :
            job_with_names = read_Travail_by_names(db=db,travail_id=job.IDRelation)
            jobs_with_names.append(job_with_names)
            
    return jobs_with_names
     