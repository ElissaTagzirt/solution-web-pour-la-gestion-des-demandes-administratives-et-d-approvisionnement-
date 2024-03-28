from sqlalchemy.orm import Session 
from sqlalchemy import or_
from models.models import User as UserModel
from models.models import ServiceSiegePosteUser as TravailModel
from models.models import Siege 
from models.models import Poste
from models.models import Service
from models import models
from schemas import user as UserSchema
from passlib.hash import bcrypt
from jose import jwt
from fastapi import HTTPException, status

# Clé secrète pour signer les tokens JWT
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

# Algorithme d'encodage pour les tokens JWT
ALGORITHM = "HS256"

# Fonction pour récupérer un utilisateur par son adresse email
def get_user_by_email(db: Session, email: str):
    return db.query(UserModel).filter(UserModel.email == email).first()

# Fonction pour créer un utilisateur normal
def create_normale_user(db: Session, user: UserSchema.userCreate, current_user: UserModel):
    # Vérifie si l'utilisateur courant est un administrateur
    if not current_user.typeUser:
        return {'detail':'Action non autorisée'}

    # Vérifie si l'adresse e-mail existe déjà dans la base de données
    existing_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if existing_user:
        return {'detail':'Cette adresse e-mail est déjà utilisée'}

    # Hachage du mot de passe
    hashed_password = bcrypt.hash(user.hashed_password)

    # Crée un nouvel utilisateur
    db_user = UserModel(
        name=user.name,
        email=user.email,
        dateNaissance = user.dateNaissance ,
        numeroDeTelephone=str(user.numeroDeTelephone),
        adresse=user.adresse,
        hashed_password=hashed_password,
        IDAdmin=current_user.IDUser
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Fonction pour créer un administrateur initial
def create_admin_user_first(db: Session, user: UserSchema.AdminCreate):
    # Hachage du mot de passe
    hashed_password = bcrypt.hash(user.hashed_password)
    
    # Crée un nouvel administrateur initial
    db_user = UserModel(
        name=user.name,
        email=user.email,
        typeUser=True,
        dateNaissance = user.dateNaissance ,
        numeroDeTelephone= str(user.numeroDeTelephone),
        adresse=user.adresse,
        hashed_password=hashed_password,
        IDAdmin=1
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Fonction pour créer un administrateur
def create_admin_user(db: Session, user: UserSchema.AdminCreate, current_user: UserModel):
    # Vérifie si l'utilisateur courant est un administrateur
    if not current_user.typeUser:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Action non autorisée")
    
    # Hachage du mot de passe
    hashed_password = bcrypt.hash(user.hashed_password)
    
    # Crée un nouvel administrateur
    db_user = UserModel(
        name=user.name,
        email=user.email,
        dateNaissance = user.dateNaissance ,
        typeUser=True,
        numeroDeTelephone=str(user.numeroDeTelephone),
        adresse=user.adresse,
        hashed_password=hashed_password,
        IDAdmin=current_user.IDUser
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Fonction pour récupérer un utilisateur par son ID
def get_user_by_id(db: Session, user_id: int, current_user: UserModel):
    if not current_user.typeUser:
        return {'detail':'Action non autorisée'}
    user = db.query(UserModel).filter(UserModel.IDUser == user_id).first()
    return UserSchema.showuser(
              IDUser  = user.IDUser ,  
                name  = user.name ,
                email = user.email , 
                dateNaissance = user.dateNaissance ,
                numeroDeTelephone = str (user.numeroDeTelephone) ,
                adresse           = user.adresse , 
                typeUser = user.typeUser )
# Fonction pour récupérer tous les utilisateurs
def get_all_users(db: Session , current_user: UserModel):
    if not current_user.typeUser:
        return {'detail':'Action non autorisée'}
    users = db.query(UserModel).all()
    user_show_user = []
    for user in users :
        o = UserSchema.showuser(
              IDUser  = user.IDUser ,  
                name  = user.name ,
                email = user.email ,
                dateNaissance = user.dateNaissance ,
                numeroDeTelephone = str (user.numeroDeTelephone) ,
                adresse           = user.adresse , 
                typeUser = user.typeUser )
        user_show_user.append(o)
    ps = db.query(Poste).all()
    sg = db.query(Siege).all()
    sv = db.query(Service).all()
    Sieges =[]
    Postes =[]
    Services = []
    for poste in ps  :
        Postes.append(poste.NomPoste)
    
    for siege in sg :
        Sieges.append(siege.NomSiege)
        
    for service in sv :
        Services.append(service.NomService)    
            
    response = UserSchema.GetUsersForAdmin(
        users = user_show_user,
        Sieges = Sieges,
        Services = Services,
        Postes = Postes
            )       
    
    return response    
    
def get_users_for_user (db:Session , current_user : UserModel ):
    if not current_user:
        raise HTTPException(status_code=404, detail="Vous n'avez pas le droit d'effectuer cette action.")

    jobs = db.query(TravailModel).filter(TravailModel.IDUser == current_user.IDUser , TravailModel.AnneeFinTravail==None).all()   
    
 # Créez des listes pour stocker les utilisateurs correspondants
    users_with_common_role_seat_service = []
     
    for job in jobs:
        users_in_service = db.query(TravailModel).filter(TravailModel.IDService == job.IDService, TravailModel.AnneeFinTravail == None).all()
        users_in_siege = db.query(TravailModel).filter(TravailModel.IDSiege == job.IDSiege, TravailModel.AnneeFinTravail == None).all()
        users_in_poste = db.query(TravailModel).filter(TravailModel.IDPoste == job.IDPoste, TravailModel.AnneeFinTravail == None).all()

        # Ajoutez les utilisateurs individuels à la liste existante
        users_with_common_role_seat_service.extend(users_in_service)
        users_with_common_role_seat_service.extend(users_in_siege)
        users_with_common_role_seat_service.extend(users_in_poste)
    
    # Supprimez les doublons en convertissant la liste en ensemble (set) puis de nouveau en liste
    users_with_common_role_seat_service = list(set(users_with_common_role_seat_service))
    liste =[]
    Sieges =[]
    Services =[]
    Postes = []
    
    for trv in users_with_common_role_seat_service :
        user = db.query(UserModel).filter(UserModel.IDUser==trv.IDUser).first()
        NomPoste=db.query(Poste).filter(Poste.IDPoste==trv.IDPoste).first().NomPoste
        NomService= db.query(Service).filter(Service.IDService==trv.IDService).first().NomService
        NomSiege=db.query(Siege).filter(Siege.IDSiege==trv.IDSiege).first().NomSiege
        o = UserSchema.UsersForUser(
          IDUser=trv.IDUser ,  
          name = user.name ,
          Telephone= str(user.numeroDeTelephone),
          Email=user.email,
          NomPoste=NomPoste,
          NomService= NomService,
          NomSiege=NomSiege,
        )
        if o not in liste:
         liste.append(o)
        if NomService not in Services:
            Services.append(NomService) 
        if NomSiege not in Sieges:
            Sieges.append(NomSiege) 
        if NomPoste not in Postes:
            Postes.append(NomPoste)         
        
    return UserSchema.GetUsersForUser(
        users = liste,
        Sieges=Sieges,
        Services=Services ,
        Postes=Postes
    ) 

# Fonction pour supprimer un utilisateur par son ID
def delete_user(user_id: int, db: Session, current_user: UserModel):
    # Vérifier si l'utilisateur actuel est un administrateur
    if not current_user.typeUser:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Action non autorisée")

    # Rechercher l'utilisateur par son ID
    user = db.query(UserModel).filter(UserModel.IDUser == user_id).first()
    # Vérifier si l'utilisateur existe
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")

    demandes = db.query(models.Demande).filter(
    or_(models.Demande.createur_id == user.IDUser, models.Demande.destinataire_id == user.IDUser)).all()
    travails = db.query(models.ServiceSiegePosteUser).filter(models.ServiceSiegePosteUser.IDUser==user.IDUser).all()
    notifs = db.query(models.Notification).filter(models.Notification.IDUserDestine ==user.IDUser).all()
    
    for demande in demandes : 
      ContenuDemande = db.query(models.ContenuDemande).filter(models.ContenuDemande.IDDemande == demande.IDDemande).all()
      for contenu in ContenuDemande:
         db.delete(contenu)
      db.delete(demande)
    
    for travail in travails :
          db.delete(travail)
          
    for notif in notifs:
        db.delete(notif)
        
              
    # Supprimer l'utilisateur de la base de données
    db.delete(user)
    db.commit()

    return {"message": "Utilisateur supprimé avec succès"}


def get_filter_users_for_admin (db: Session, filters: UserSchema.UserFilter, current_user: UserModel):
    if not current_user.typeUser:
        return {'detail':'Action non autorisée'} 
    
    jobs = db.query(TravailModel).all() 
    liste = []
    if jobs :
      
      for job in jobs :
        user = db.query(UserModel).filter(UserModel.IDUser==job.IDUser).first()
        
        NomPoste=db.query(Poste).filter(Poste.IDPoste==job.IDPoste).first().NomPoste
        
        NomService= db.query(Service).filter(Service.IDService==job.IDService).first().NomService
       
        NomSiege=db.query(Siege).filter(Siege.IDSiege==job.IDSiege).first().NomSiege
       
        include_user = True
        # Appliquer le filtre Mot (téléphone, nom ou email)
        if filters.Mot != "str":
    # Vérifier si filters.Mot n'est pas une sous-chaîne en majuscules de user.numeroDeTelephone
            if str(user.numeroDeTelephone).upper().find(filters.Mot.upper()) == -1:
                # Vérifier si filters.Mot n'est pas égal à user.name (en supposant que filters.Mot soit une chaîne de caractères)
                if filters.Mot.upper() != str(user.name).upper():
                    # Convertir user.email en majuscules et vérifier si filters.Mot n'est pas une sous-chaîne de user.email
                    if filters.Mot.upper() not in str(user.email).upper():
                        # Si toutes les conditions ci-dessus sont satisfaites, l'utilisateur n'est pas inclus
                        include_user = False


        # Appliquer le filtre Siege
        if filters.Siege!="str" and filters.Siege.upper() != str(NomSiege).upper():
            include_user = False
            

        # Appliquer le filtre Service
        if filters.Service != "str" and filters.Service.upper() != str(NomService).upper():
            include_user = False
         
        
        # Appliquer le filtre Poste
        if filters.Poste != "str" and filters.Poste.upper() != str(NomPoste).upper():
            include_user = False
        

      

        # Si toutes les conditions sont remplies, ajouter l'utilisateur filtré
        if include_user:
            
            
                o = UserSchema.showuser(
                IDUser  = user.IDUser ,  
                name  = user.name ,
                email = user.email , 
                dateNaissance = user.dateNaissance ,
                numeroDeTelephone = str (user.numeroDeTelephone) ,
                adresse           = user.adresse , 
                typeUser = user.typeUser )
            
                if o not in liste:
                 liste.append(o)

    return liste
    
    
def get_filter_users_for_user(db: Session, filters: UserSchema.UserFilter, current_user: UserModel):
    if not current_user:
      raise HTTPException(status_code=404, detail="Vous n'avez pas le droit d'effectuer cette action.")

    jobs = db.query(TravailModel).filter(TravailModel.IDUser == current_user.IDUser , TravailModel.AnneeFinTravail==None).all()   
    
 # Créez des listes pour stocker les utilisateurs correspondants
    users_with_common_role_seat_service = []

    for job in jobs:
        users_in_service = db.query(TravailModel).filter(TravailModel.IDService == job.IDService, TravailModel.AnneeFinTravail == None).all()
        users_in_siege = db.query(TravailModel).filter(TravailModel.IDSiege == job.IDSiege, TravailModel.AnneeFinTravail == None).all()
        users_in_poste = db.query(TravailModel).filter(TravailModel.IDPoste == job.IDPoste, TravailModel.AnneeFinTravail == None).all()

        # Ajoutez les utilisateurs à la liste existante
        users_with_common_role_seat_service.extend(users_in_service)
        users_with_common_role_seat_service.extend(users_in_siege)
        users_with_common_role_seat_service.extend(users_in_poste)

    # Supprimez les doublons en convertissant la liste en ensemble (set) puis de nouveau en liste
    users_with_common_role_seat_service = list(set(users_with_common_role_seat_service))
    liste =[]
    for trv in users_with_common_role_seat_service :
        user = db.query(UserModel).filter(UserModel.IDUser==trv.IDUser).first()
        
        NomPoste=db.query(Poste).filter(Poste.IDPoste==trv.IDPoste).first().NomPoste
        NomService= db.query(Service).filter(Poste.IDPoste==trv.IDService).first().NomService
        NomSiege=db.query(Siege).filter(Poste.IDPoste==trv.IDSiege).first().NomSiege
        
        include_user = True

        if filters.Mot != "str":
    # Vérifier si filters.Mot n'est pas une sous-chaîne en majuscules de user.numeroDeTelephone
            if str(user.numeroDeTelephone).upper().find(filters.Mot.upper()) == -1:
                # Vérifier si filters.Mot n'est pas égal à user.name (en supposant que filters.Mot soit une chaîne de caractères)
                if filters.Mot.upper() != str(user.name).upper():
                    # Convertir user.email en majuscules et vérifier si filters.Mot n'est pas une sous-chaîne de user.email
                    if filters.Mot.upper() not in str(user.email).upper():
                        # Si toutes les conditions ci-dessus sont satisfaites, l'utilisateur n'est pas inclus
                        include_user = False



        # Appliquer le filtre Siege
        if filters.Siege!="str" and filters.Siege.upper() != NomSiege.upper():
            include_user = False
            

        # Appliquer le filtre Service
        if filters.Service != "str" and filters.Service.upper() != NomService.upper():
            include_user = False
         
        
        # Appliquer le filtre Poste
        if filters.Poste != "str" and filters.Poste.upper() != NomPoste.upper():
            include_user = False
        

      

        # Si toutes les conditions sont remplies, ajouter l'utilisateur filtré
        if include_user:
            
                o = UserSchema.UsersForUser(
                IDUser=trv.IDUser ,  
                name = user.name ,
                Telephone= str(user.numeroDeTelephone),
                Email=user.email,
                NomPoste= NomPoste,
                NomService= NomService,
                NomSiege=NomSiege,
                )
            
                if o not in liste:
                 liste.append(o)

    return liste

# Fonction pour authentifier un utilisateur par email et mot de passe
def authenticate_user(email: str, password: str, db: Session):
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invalid Credentials")
    if not bcrypt.verify(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Incorrect password")
    return user

# Fonction pour créer un token d'accès JWT
def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Fonction pour changer le mot de passe
def change_password(db: Session, user_id: int, current_password: str, new_password: str):
    # Récupérer l'utilisateur par son ID
    user = db.query(UserModel).filter(UserModel.IDUser == user_id).first()
    
    # Vérifier si l'utilisateur existe
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")
    
    # Vérifier si le mot de passe actuel est correct
    if not bcrypt.verify(current_password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="votre mot de passe actuel est incorrect")
        # return {"message": "votre mot de passe actuel est incorrect"}
    
    # Hacher le nouveau mot de passe
    hashed_new_password = bcrypt.hash(new_password)
    
    # Mettre à jour le mot de passe dans la base de données
    user.hashed_password = hashed_new_password
    db.commit()
    
    return {"message": "Mot de passe mis à jour avec succès"}

#mettre a jour les information de l'utilisateur 
def update_user_info(user_id: int, updated_info: UserSchema.UpdateInfoUser, db: Session , current_user : UserModel):
    # Recherche de l'utilisateur par son ID
    if current_user.IDUser != user_id and current_user.typeUser == False :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Action non autorisée")
    user = db.query(UserModel).filter(UserModel.IDUser == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # Mise à jour des informations de l'utilisateur si les champs ne sont pas vides
    if updated_info.numeroDeTelephone:
        user.numeroDeTelephone = updated_info.numeroDeTelephone
    if updated_info.adresse:
        user.adresse = updated_info.adresse
    if updated_info.username:
        user.name = updated_info.username
    if not (updated_info.username or updated_info.username or updated_info.numeroDeTelephone) :
        raise HTTPException(status_code=404, detail="Veuillez introduire les informations à mettre à jour")
    
    db.commit()
    db.refresh(user)

    return {"message": "Informations utilisateur mises à jour avec succès"}

def update_user_info_admin(user_id: int, updated_info: UserSchema.UserBase, db: Session , current_user : UserModel):
    # Recherche de l'utilisateur par son ID
    if  current_user.typeUser == False :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Action non autorisée")
    user = db.query(UserModel).filter(UserModel.IDUser == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # Mise à jour des informations de l'utilisateur si les champs ne sont pas vides
    if updated_info.numeroDeTelephone != '':
        user.numeroDeTelephone = updated_info.numeroDeTelephone
    if updated_info.adresse != '':
        user.adresse = updated_info.adresse
    if updated_info.name != '':
        user.name = updated_info.name
    if not (updated_info.name or updated_info.name or updated_info.numeroDeTelephone or updated_info.email) :
        raise HTTPException(status_code=405, detail="Veuillez introduire les informations à mettre à jour")
    if updated_info.email != '':
    
     user_with_email = db.query(UserModel).filter(UserModel.email == updated_info.email).first()
     
     if user_with_email != None:
            return {"detail":"L'email introduit appartient déjà à une personne"} 
     if user_with_email == None :
            user.email = updated_info.email 
    db.commit()
    db.refresh(user)

    return {"message": "Informations utilisateur mises à jour avec succès"}

def change_Statue_User(IDuser:int , type :bool,db:Session ,current_user :UserModel ):
    if  current_user.typeUser == False :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Action non autorisée")
    user = db.query(UserModel).filter(UserModel.IDUser == IDuser).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    user.typeUser = type
    db.commit()
    db.refresh(user)
    return "type change"
    