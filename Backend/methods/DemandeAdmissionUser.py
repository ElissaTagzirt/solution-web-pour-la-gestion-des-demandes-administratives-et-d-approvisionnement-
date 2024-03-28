from sqlalchemy.orm import Session  
from models.models import User as UserModel
from models.models import STATUES_DEMANDE_ADMISSION as SDA
from models.models import DemandeAdminition as DemandeAdminitionModel
from passlib.hash import bcrypt
from fastapi import HTTPException
from sqlalchemy import and_
from schemas.DemandeAdmissionUser import  DemandeAdminitionUpdate , DemandeAdminitionBase ,  DemandeAdminitionCreate , DemandeAdminition

# Fonction pour créer une demande d'admission
def create_demande_adminition(db: Session, demande: DemandeAdminitionCreate):
    
    # Vérifie si un utilisateur ou une demande avec la même adresse e-mail existe déjà
    existing_user = db.query(UserModel).filter(UserModel.email == demande.email).first()
    existing_demande = db.query(DemandeAdminitionModel).filter(DemandeAdminitionModel.email == demande.email).first()
    
    if existing_user or existing_demande:
        return {'detail':'Cette adresse e-mail est déjà utilisée'}
    else:
        # Crée une nouvelle demande d'admission dans la base de données
        db_demande = DemandeAdminitionModel(
            hashed_password=bcrypt.hash(demande.hashed_password),
            typeUser=False,
            name=demande.name,
            email=demande.email,
            numeroDeTelephone=demande.adresse,
            adresse=demande.adresse,
            dateNaissance=demande.dateNaissance
        )
        db.add(db_demande)
        db.commit()
        db.refresh(db_demande)
        return {'message':'La demande a été correctement enregistrée et transmise.'}

# Fonction pour mettre à jour une demande d'admission
def update_demande_adminition(db: Session, demande: DemandeAdminitionUpdate, current_user: UserModel):
    if current_user.typeUser == False:
        raise HTTPException(status_code=401, detail="Action non autorisée")
    
    # Récupère la demande d'admission à mettre à jour
    db_demande = db.query(DemandeAdminitionModel).filter(DemandeAdminitionModel.IDDemandeAdminition == demande.IDDemandeAdminition).first()
    
    if db_demande is None:
        raise HTTPException(status_code=404, detail="Demande d'admission non trouvée")
    
    # Vérifie si un utilisateur ou une demande avec la même adresse e-mail existe déjà
    existing_user = db.query(UserModel).filter(UserModel.email == demande.email).first()
    existing_demande = db.query(DemandeAdminitionModel).filter(DemandeAdminitionModel.email == demande.email).first()
    
    if existing_user or existing_demande:
        return {'detail':'Cette adresse e-mail est déjà utilisée'}
    else:
        # Met à jour les attributs de la demande d'admission
        for key, value in demande.dict(exclude_unset=True).items():
            setattr(db_demande, key, value)
        db.commit()
        db.refresh(db_demande)
    
    return {"message":"demande mise à jour avec succès"}

# Fonction pour récupérer une demande d'admission par son ID et ajouter un utilisateur
def Add_user_by_demande_adminition(db: Session, demande_id: int, current_user: UserModel):
    if current_user.typeUser == False:
        raise HTTPException(status_code=401, detail="Action non autorisée")
    
    # Récupère la demande d'admission par son ID
    db_demande = db.query(DemandeAdminitionModel).filter(
        and_(
            DemandeAdminitionModel.IDDemandeAdminition == demande_id,
            DemandeAdminitionModel.StatueDemande != SDA[1]
        )
    ).first()
    
    if db_demande is None:
        raise HTTPException(status_code=404, detail="Demande d'admission non trouvée")
    
    # Vérifie si un utilisateur avec la même adresse e-mail existe déjà
    existing_user = db.query(UserModel).filter(UserModel.email == db_demande.email).first()
    if existing_user:
        return {'detail':'Cette adresse e-mail est déjà utilisée'}
    
    # Crée un nouvel utilisateur dans la base de données
    db_user = UserModel(
        name=db_demande.name,
        email=db_demande.email,
        dateNaissance=db_demande.dateNaissance,
        numeroDeTelephone=str(db_demande.numeroDeTelephone),
        adresse=db_demande.adresse,
        hashed_password=db_demande.hashed_password,
        IDAdmin=current_user.IDUser
    )
    db.add(db_user)
    db_demande.StatueDemande = SDA[1]
    db.commit()
    db.refresh(db_user)
    
    return {"message":"utilisateur ajouté à la base de données"}

# Fonction pour supprimer une demande d'admission
def delete_demande_adminition(db: Session, demande_id: int, current_user: UserModel):
    if current_user.typeUser == False:
        raise HTTPException(status_code=401, detail="Action non autorisée")
    
    # Récupère la demande d'admission par son ID et la supprime
    db_demande = db.query(DemandeAdminitionModel).filter(DemandeAdminitionModel.IDDemandeAdminition == demande_id).first()
    if db_demande is None:
        raise HTTPException(status_code=404, detail="Demande d'admission non trouvée")
    else:
        db.delete(db_demande)
        db.commit()
    
    return {"message":"demande supprimée"}

# Fonction pour récupérer toutes les demandes d'admission en attente
def get_all_demande_adminitions(db: Session, current_user: UserModel):
    if current_user.typeUser == False:
        raise HTTPException(status_code=401, detail="Action non autorisée")
    else:
        # Récupère toutes les demandes d'admission en attente
        return db.query(DemandeAdminitionModel).filter(DemandeAdminitionModel.StatueDemande == "En attente").all()
