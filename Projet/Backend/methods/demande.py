from fastapi import HTTPException , Depends
from sqlalchemy.orm import Session
from models import models
from schemas import demande as schemas
from datetime import datetime 
from schemas.outil import GetOutil
from fastapi import HTTPException , status
from methods.notification import create_notification
from schemas.notification import Notification


def create_demande(db: Session, demande_data: schemas.DemandeCreate, current_user: models.User):
    if not current_user :
      raise HTTPException(status_code=401, detail="Action non autorisée")  
    user = db.query(models.User).filter(models.User.email ==  demande_data.destinataire_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="L'adresse e-mail introduite est incorrecte")
   
    Mposte = db.query(models.Poste).filter(models.Poste.NomPoste == demande_data.MonPoste.upper()).first()
    Dposte = db.query(models.Poste).filter(models.Poste.NomPoste == demande_data.NomPosteDestinataire.upper()).first()
    if not Mposte and not Dposte:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Le poste spécifié n'existe pas")

    # Vérifiez l'existence de IDSiege
    Msiege = db.query(models.Siege).filter(models.Siege.NomSiege == demande_data.MonSiege.upper()).first()
    Dsiege = db.query(models.Siege).filter(models.Siege.NomSiege == demande_data.NomSiegeDestinataire.upper()).first()
    if not Msiege and Dsiege:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Le siège spécifié n'existe pas")

    # Vérifiez l'existence de IDService
    Mservice = db.query(models.Service).filter(models.Service.NomService == demande_data.MonService.upper()).first()
    Dservice = db.query(models.Service).filter(models.Service.NomService == demande_data.NomServiceDestinataire.upper()).first()
    if not Mservice and not Dservice:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Le service spécifié n'existe pas")
    
    
     #return print(type(demande_data.DateDernierDelai))
    db_demande = models.Demande( 
                                DateDernieDelai = demande_data.DateDernierDelai ,
                                ObjetDemande = demande_data.ObjetDemande ,
                                Description = demande_data.Description ,
                                
                                destinataire_email = demande_data.destinataire_email,
                                destinataire_id = user.IDUser,
                                createur_id = current_user.IDUser,
                                
                                MonPoste = Mposte.NomPoste, 
                                MonSiege = Msiege.NomSiege,
                                MonService = Mservice.NomService,
                                
                                NomPosteDestinataire = Dposte.NomPoste,
                                NomSiegeDestinataire =Dsiege.NomSiege ,
                                NomServiceDestinataire = Dservice.NomService
                                )
    db.add(db_demande)
    db.commit()
    db.refresh(db_demande)
   
    demande = schemas.AfficheDemande(
                IDDemande= db_demande.IDDemande,
                ObjetDemande=db_demande.ObjetDemande, 
                Description =db_demande.Description,
                StatueDemande=db_demande.StatueDemande,
                
                DateCreation=db_demande.DateCreation,
                DateMiseAjour=db_demande.DateMiseAjour,
                DateDernieDelia=db_demande.DateDernieDelai,
                
                createur_id = db_demande.createur_id,
                destinataire_email = db_demande.destinataire_email,
                
                MonSiege = demande_data.MonSiege ,
                MonService= demande_data.MonService,
                MonPoste = db_demande.MonPoste,
                
                NomSiegeDestinataire =db_demande.NomSiegeDestinataire ,
                NomServiceDestinataire = db_demande.NomServiceDestinataire,
                NomPosteDestinataire=db_demande.NomPosteDestinataire,
                                
            
    )
    createur = db.query(models.User).filter(models.User.IDUser ==db_demande.createur_id ).first()
    
    notification_data = Notification(
                            IDDemandeAssocie = db_demande.IDDemande,
                            IDUserDestine= db_demande.destinataire_id,
                            ContenuNotif= f"Vous avez reçu une nouvelle demande de la part de {createur.email}.",
                            )
    create_notification(db, notification_data)
    
    return demande

def Ajouter_outils_nouvelle_demande(db:Session,IDDemande:int ,demande_with_outils: schemas.CreateOutilsDemande ,current_user: models.User):
    db_demande = db.query(models.Demande).filter(models.Demande.IDDemande==IDDemande).first()
    if current_user.IDUser != db_demande.createur_id and current_user.IDUser != db_demande.destinataire_id:
        raise HTTPException(status_code=403, detail="Vous n'avez pas le droit de mettre à jour cette demande.")
    
    # recupere tous les outils
    outils = demande_with_outils.outils
    # Associer les outils à la demande
    for outil in outils:
        db_outil = db.query(models.Outil).filter(models.Outil.NomOutil == outil.NomOutil.upper()).first()
        if db_outil:
            contenu_demande = models.ContenuDemande(IDDemande=db_demande.IDDemande, 
                                                    IDOutil=db_outil.IDOutil ,
                                                    Quantite = outil.Quantite ,
                                                    NomOutil = db_outil.NomOutil,                                                 
                                                    DescriptionUser= db_outil.Description)
            db.add(contenu_demande)
        else:
            contenu_demande = models.ContenuDemande(IDDemande=db_demande.IDDemande, 
                                                    IDOutil=None ,
                                                    Quantite = outil.Quantite,
                                                    NomOutil = outil.NomOutil ,
                                                    DescriptionUser= outil.Description
                                                    )
                                                    
            db.add(contenu_demande)

    db.commit()
    return demande_with_outils

def get_Demande_toUpdate(db: Session, demande_id: int, current_user: models.User):
     # Vérification que l'utilisateur courant est bien le créateur ou le destinataire de la demande
    db_demande = db.query(models.Demande).filter(models.Demande.IDDemande == demande_id).first()
    if not db_demande:
        raise HTTPException(status_code=404, detail="Demande non trouvée.")
    
    if current_user.IDUser != db_demande.createur_id and current_user.IDUser != db_demande.destinataire_id:
        raise HTTPException(status_code=403, detail="Vous n'avez pas le droit de mettre à jour cette demande.")
    
    db_outils = db.query(models.ContenuDemande).filter(models.ContenuDemande.IDDemande == db_demande.IDDemande ,models.Demande.createur_id == current_user.IDUser ).all()
    
    outils=[]
    for outil in db_outils:
            outil_from_tableOutil = db.query(models.Outil).filter(models.Outil.IDOutil == outil.IDOutil).first()
            if outil_from_tableOutil :
                o = GetOutil(
                    IDOutil=outil_from_tableOutil.IDOutil,
                    NomOutil=outil_from_tableOutil.NomOutil,
                    Description=outil_from_tableOutil.Description,
                    Quantite=outil.Quantite)
                outils.append(o)
            else : 
                
                o = GetOutil(
                    IDOutil = 0,
                    NomOutil=outil.NomOutil,
                    Description=outil.DescriptionUser,
                    Quantite=outil.Quantite,
                    )
                
                outils.append(o)
                
    return schemas.GetDemandetoUpdate(
                Description =db_demande.Description ,
                outils=outils)
    
def set_update_demande(db: Session, demande_id: int, demande_update: schemas.GetDemandetoUpdate, current_user: models.User):
    db_demande = db.query(models.Demande).filter(models.Demande.IDDemande == demande_id).first()
    if not db_demande:
        raise HTTPException(status_code=404, detail="Demande non trouvée.")

    if current_user.IDUser != db_demande.createur_id and current_user.IDUser != db_demande.destinataire_id:
        raise HTTPException(status_code=403, detail="Vous n'avez pas le droit de mettre à jour cette demande.")

    if demande_update.Description != '':
        db_demande.Description = demande_update.Description

    # Créez un ensemble (set) pour stocker les noms d'outils à mettre à jour
    noms_outils_a_mettre_a_jour = set()

    if demande_update.outils:
        for outil in demande_update.outils:
            db_outil = db.query(models.Outil).filter(models.Outil.NomOutil == outil.NomOutil.upper()).first()
            if db_outil:
                noms_outils_a_mettre_a_jour.add(db_outil.NomOutil)

                contenu_demande = db.query(models.ContenuDemande).filter(
                    models.ContenuDemande.IDDemande == demande_id,
                    models.ContenuDemande.IDOutil == db_outil.IDOutil
                ).first()
                if contenu_demande and outil.Quantite is not None:
                    contenu_demande.Quantite = outil.Quantite
                else:
                    nouveau_contenu_demande = models.ContenuDemande(
                        IDDemande=demande_id,
                        IDOutil=db_outil.IDOutil,
                        Quantite=outil.Quantite,
                        DescriptionUser=db_outil.Description,
                        NomOutil=db_outil.NomOutil
                    )
                    db.add(nouveau_contenu_demande)
            else:
                contenu_demande = models.ContenuDemande(
                    IDDemande=demande_id,
                    IDOutil=None,
                    DescriptionUser=outil.Description,
                    NomOutil=outil.NomOutil,
                    Quantite=outil.Quantite
                )
                db.add(contenu_demande)

    # Supprimez les outils qui ne sont pas dans l'ensemble "noms_outils_a_mettre_a_jour"
    db.query(models.ContenuDemande).filter(
        models.ContenuDemande.IDDemande == demande_id,
        ~models.ContenuDemande.NomOutil.in_(noms_outils_a_mettre_a_jour)
    ).delete(synchronize_session=False)

    db_demande.DateMiseAjour = datetime.utcnow()
    db.commit()
    db.refresh(db_demande)
    notification_data = Notification(
                            IDDemandeAssocie= db_demande.IDDemande,
                            IDUserDestine= db_demande.destinataire_id,
                            ContenuNotif= f"La demande n°{db_demande.IDDemande} a été modifiée par {current_user.name}.",)
    create_notification(db, notification_data)
    return "Modification valide"
 
def Annuler_Demande (db: Session, demande_id: int, current_user: models.User):
    demande = db.query(models.Demande).filter(models.Demande.IDDemande==demande_id).first()
    if current_user==False and demande.createur_id != current_user.IDUser :
        raise HTTPException(status_code=403, detail="Vous n'avez pas le droit de supprimer cette demande.")
     
    if not demande :
        raise HTTPException(status_code=406, detail="Demande non trouvée.")
    if demande.StatueDemande == models.STATUES_DEMANDE[4] :
       raise HTTPException(status_code=404, detail="La demande est déja annuler")     
    
    demande.StatueDemande  = models.STATUES_DEMANDE[4] 
    db.commit()
    db.refresh(demande) 
    notification_data = Notification(
                            IDDemandeAssocie= demande.IDDemande,
                            IDUserDestine= demande.destinataire_id,
                            ContenuNotif= f"La demande numéro {demande.IDDemande} a été annulée par l'utilisateur {current_user.name}.",)
    
    create_notification(db, notification_data)
    return " Demande Annuler" 

def archiver_Demande (db: Session, demande_id: int, current_user: models.User):
    demande = db.query(models.Demande).filter(models.Demande.IDDemande==demande_id).first()
    if current_user==False and demande.createur_id != current_user.IDUser and demande.destinataire_id != current_user.IDUser:
        raise HTTPException(status_code=401, detail="Vous n'avez pas le droit de supprimer cette demande.")
     
    if not demande :
        raise HTTPException(status_code=404, detail="Demande non trouvée.")
    # si la demade est valide on l'a    joute dans la liste des demande archeve valide
    if demande.StatueDemande   == models.STATUES_DEMANDE[2] :
        demande.StatueDemande  = models.STATUES_DEMANDE[3] 
        db.commit()
        db.refresh(demande) 
        notification_data = Notification(
                            IDDemandeAssocie= demande.IDDemande,
                            IDUserDestine= demande.destinataire_id,
                            ContenuNotif= f"La demande numéro {demande.IDDemande} a été ajoutée aux archives des demandes validées par l'utilisateur {current_user.name}.",)
    
        create_notification(db, notification_data)
        return "Demande Archiver" 
    # si la demande et annuler ou innatingiable elle sera archevie dans les demande annuler
    elif demande.StatueDemande   == models.STATUES_DEMANDE[5]  or demande.StatueDemande   == models.STATUES_DEMANDE[6]:
             demande.StatueDemande  = models.STATUES_DEMANDE[4] 
             db.commit()
             db.refresh(demande) 
             notification_data = Notification(
                            IDDemandeAssocie= demande.IDDemande,
                            IDUserDestine= demande.destinataire_id,
                            ContenuNotif= f"La demande numéro {demande.IDDemande} a été ajoutée aux archives des demandes annulées par l'utilisateur {current_user.name}.",)
    
             create_notification(db, notification_data)
             
             return "Demande Archiver" 
    else :
          raise HTTPException(status_code=404, detail="Vous ne pouvez pas effectuer cette action.")      

#recupere tous les demande envoie pour l'utlisateur coraament connecte
def get_all_demande_user_sans_outils_recues(db:Session, current_user :models.User):
    demandes = db.query(models.Demande).filter(models.Demande.destinataire_id==current_user.IDUser,~models.Demande.StatueDemande.in_([models.STATUES_DEMANDE[4], models.STATUES_DEMANDE[3]])).all()
   
    if not demandes :
        return []   
    demandes_sans_outils = []
    for demande in demandes: 
        createur  =  db.query(models.User).filter(models.User.IDUser==demande.createur_id).first()
      
        # Créez une instance de DemandeAvecOutils
        demande_sans_outils = schemas.AfficheEnsomleDemande(
                IDDemande=demande.IDDemande,
                ObjetDemande=demande.ObjetDemande, 
                
                DateMiseAjour=demande.DateMiseAjour, 
                DateDernieDelai=demande.DateDernieDelai,
                
                destinataire_email = createur.email,
                NomSiegeDestinataire =demande.NomSiegeDestinataire ,
                NomServiceDestinataire = demande.NomServiceDestinataire,
                NomPosteDestinataire = demande.NomPosteDestinataire,
                
                StatueDemande=demande.StatueDemande
                
            )
       
        demandes_sans_outils.append(demande_sans_outils)

    return demandes_sans_outils

#recupere tous les demandes crees par l'utilisateur currament connecte sans leur outils
def get_all_demande_user_sans_outils(db: Session, current_user: models.User):
    demandes = db.query(models.Demande).filter(models.Demande.createur_id == current_user.IDUser,~models.Demande.StatueDemande.in_([models.STATUES_DEMANDE[4], models.STATUES_DEMANDE[3]])).all()
    if not demandes :
        return []
    demandes_sans_outils = []
    for demande in demandes:     
        # Créez une instance de DemandeAvecOutils
        demande_sans_outils = schemas.AfficheEnsomleDemande(
                IDDemande=demande.IDDemande,
                ObjetDemande=demande.ObjetDemande, 
                
                DateMiseAjour=demande.DateMiseAjour, 
                DateDernieDelai=demande.DateDernieDelai,
                
                destinataire_email = demande.destinataire_email,
                NomSiegeDestinataire =demande.NomSiegeDestinataire ,
                NomServiceDestinataire = demande.NomServiceDestinataire,
                NomPosteDestinataire = demande.NomPosteDestinataire,
                
                StatueDemande=demande.StatueDemande
                
            )
       
        demandes_sans_outils.append(demande_sans_outils)

    return demandes_sans_outils
 
def change_statue_demande (db: Session, demande_id: int, numero_statue : int , current_user: models.User) :
    db_demande = db.query(models.Demande).filter(models.Demande.IDDemande == demande_id).first()
    if not db_demande:
        raise HTTPException(status_code=404, detail="Demande non trouvée.")
    
    if current_user.IDUser != db_demande.createur_id and current_user.IDUser != db_demande.destinataire_id and current_user.typeUser == False:
        raise HTTPException(status_code=401, detail="Vous n'avez pas le droit de mettre à jour cette demande.")
    
    # on veut mettre la demande en tattente  a considtion que ce la est effectue uniquemment pour le createur et la demande ete annuler ou qrchiver annuler
    if numero_statue == 0  and ( db_demande.StatueDemande == models.STATUES_DEMANDE[5] or 
                                db_demande.StatueDemande ==models.STATUES_DEMANDE[4 ]or  
                                db_demande.StatueDemande==models.STATUES_DEMANDE[6]
                                ) and current_user.IDUser == db_demande.createur_id :
       db_demande.StatueDemande = models.STATUES_DEMANDE[0] 
       db.commit()
       db.refresh(db_demande) 
       notification_data = Notification(
                            IDDemandeAssocie= db_demande.IDDemande,
                            IDUserDestine= db_demande.destinataire_id,
                            ContenuNotif= f"La demande numéro {db_demande.IDDemande} a été mise en attente par l'utilisateur {current_user.name} ",)
    
       create_notification(db, notification_data)
       return {"detail" :"Action faite" }
   
    # mettre la demande en cour a condition que c'est le destistaire et que la demande est soit valide archiver annuler ou inatteignable
    elif numero_statue == 1 and (db_demande.StatueDemande == models.STATUES_DEMANDE[0 ]
                                 or db_demande.StatueDemande == models.STATUES_DEMANDE[2] 
                                 or db_demande.StatueDemande == models.STATUES_DEMANDE[5 ]
                                 or db_demande.StatueDemande == models.STATUES_DEMANDE[6 ]
                                 ) and current_user.IDUser == db_demande.destinataire_id :   
        db_demande.StatueDemande = models.STATUES_DEMANDE[1]
        db.commit()
        db.refresh(db_demande) 
        notification_data = Notification(
                            IDDemandeAssocie= db_demande.IDDemande,
                            IDUserDestine= db_demande.destinataire_id,
                            ContenuNotif= f"La demande numéro {db_demande.IDDemande} a été mise en cours par l'utilisateur {current_user.name} ",)
    
        create_notification(db, notification_data)
        
        return {"detail" :"Action faite" }
    
    #mettre la demande dans le cas valide a condition que c'est le destinataire qui le fait et que la demande soit dans l'etat en cour ou en attente en cour ou archive valide
    elif numero_statue == 2 and (db_demande.StatueDemande == models.STATUES_DEMANDE[1] or
                                 db_demande.StatueDemande == models.STATUES_DEMANDE[0] or
                                 db_demande.StatueDemande == models.STATUES_DEMANDE[3]
                                 ) and current_user.IDUser == db_demande.destinataire_id :     
        db_demande.StatueDemande = models.STATUES_DEMANDE[2]
        db.commit()
        db.refresh(db_demande) 
        notification_data = Notification(
                            IDDemandeAssocie= db_demande.IDDemande,
                            IDUserDestine= db_demande.destinataire_id,
                            ContenuNotif= f"La demande numéro {db_demande.IDDemande} a été validée par l'utilisateur {current_user.name} ",)
    
        create_notification(db, notification_data)
        return {"detail" :"Action faite 2 " }
    
    

     
    #annuler la demande a condition que c'est le createur qui le fait et que la demande soit dans l'etat en cour ou en attente en cour ou archive valide ou archive annuler
       
    elif numero_statue == 5 and (db_demande.StatueDemande == models.STATUES_DEMANDE[0] 
                                 or db_demande.StatueDemande == models.STATUES_DEMANDE[1] 
                                 or db_demande.StatueDemande == models.STATUES_DEMANDE[2] 
                                 or db_demande.StatueDemande == models.STATUES_DEMANDE[4] ) and  current_user.IDUser == db_demande.createur_id :
        db_demande.StatueDemande = models.STATUES_DEMANDE[5]
        db.commit()
        db.refresh(db_demande) 
        notification_data = Notification(
                            IDDemandeAssocie= db_demande.IDDemande,
                            IDUserDestine= db_demande.destinataire_id,
                            ContenuNotif= f"La demande numéro {db_demande.IDDemande} est  signalée par l'utilisateur {current_user.name}  comme étant annulée",)
        create_notification(db, notification_data)
        return {"detail" :"Action faite" }
    # annonce que la demande et innateignable a condition qu'elle est en cour en attent ou valide    
    elif numero_statue == 6  and (db_demande.StatueDemande == models.STATUES_DEMANDE[0] 
                                or db_demande.StatueDemande == models.STATUES_DEMANDE[1]
                                or db_demande.StatueDemande == models.STATUES_DEMANDE[2]) and  current_user.IDUser == db_demande.destinataire_id :
       db_demande.StatueDemande = models.STATUES_DEMANDE[6]
       db.commit()
       db.refresh(db_demande) 
       notification_data = Notification(
                            IDDemandeAssocie= db_demande.IDDemande,
                            IDUserDestine= db_demande.destinataire_id,
                            ContenuNotif= f"La demande numéro {db_demande.IDDemande} est signalée par l'utilisateur {current_user.name}  comme étant inatteignable.",)
    
       create_notification(db, notification_data)
       return {"detail" :"Action faite" }
    
    # l'admin peut effectue n'importe qu'elle action sur la demande   
    elif  current_user.typeUser == False :
        db_demande.StatueDemande = models.STATUES_DEMANDE[numero_statue]
        db.commit()
        db.refresh(db_demande)
        notification_data = Notification(
                            IDDemandeAssocie= db_demande.IDDemande,
                            IDUserDestine= db_demande.destinataire_id,
                            ContenuNotif= f"La demande numéro {db_demande.IDDemande} a été mise  {models.STATUES_DEMANDE[numero_statue]} , par l'administrateur ",)
    
        create_notification(db, notification_data)
        return {"detail" :"Action faite" }
    raise HTTPException(status_code=404, detail="Vous ne pouvez pas effectuer cette action.")   
           

# Récupérer une demande spécifique par son ID
def get_demande_by_id(db: Session, demande_id: int, current_user: models.User):
    
    demande =db.query(models.Demande).filter(models.Demande.IDDemande == demande_id).first()
    if not demande :
        return None  

   
        # Récupérez les outils associés à cette demande depuis la table ContenuDemande
    db_outils = db.query(models.ContenuDemande).filter(models.ContenuDemande.IDDemande == demande.IDDemande).all()
    
    outils=[]
    for outil in db_outils:
            outil_from_tableOutil = db.query(models.Outil).filter(models.Outil.IDOutil == outil.IDOutil).first()
            if outil_from_tableOutil :
                o = GetOutil(
                    IDOutil=outil_from_tableOutil.IDOutil,
                    NomOutil=outil_from_tableOutil.NomOutil,
                    Description=outil_from_tableOutil.Description,
                    Quantite=outil.Quantite)
                outils.append(o)
            else : 
                
                o = GetOutil(
                    IDOutil = 0,
                    NomOutil=outil.NomOutil,
                    Description=outil.DescriptionUser,
                    Quantite=outil.Quantite
                    )
                
                outils.append(o)
    user_emmeteur = db.query(models.User).filter(models.User.IDUser==demande.createur_id).first()   
                  
    userDestinataire = db.query(models.User).filter(models.User.IDUser==demande.destinataire_id).first()   
        # Créez une instance de DemandeAvecOutils
    demande_avec_outils = schemas.ConsulterMaDemande(
    
                IDDemande=demande.IDDemande,
                ObjetDemande=demande.ObjetDemande, 
                Description =demande.Description,
                StatueDemande= demande.StatueDemande,
                
                DateCreation=demande.DateCreation,
                DateMiseAjour=demande.DateMiseAjour,
                DateDernieDelia=demande.DateDernieDelai,
                
                createur_id = demande.createur_id,
                destinataire_email = demande.destinataire_email,
                
                MonSiege= demande.MonSiege ,
                MonService =demande.MonService,
                MonPoste= demande.MonPoste ,
                
                NomSiegeDestinataire =demande.NomSiegeDestinataire ,
                NomServiceDestinataire = demande.NomServiceDestinataire,
                NomPosteDestinataire= demande.NomPosteDestinataire,
                
                MonTelephone= str(user_emmeteur.numeroDeTelephone),
                MonEmail = user_emmeteur.email,
                MonNom = user_emmeteur.name ,
                
                DestinataireTel = str(userDestinataire.numeroDeTelephone) ,
                DestinataireNom = userDestinataire.name ,
                
                
                outils=outils
                
            )
    return demande_avec_outils
     
          
def update_demande(db: Session, demande_id: int, demande_update: schemas.DemandeUpdate, current_user: models.User):
    # Vérification que l'utilisateur courant est bien le créateur ou le destinataire de la demande
    db_demande = db.query(models.Demande).filter(models.Demande.IDDemande == demande_id).first()
    if not db_demande:
        raise HTTPException(status_code=404, detail="Demande non trouvée.")
    
    if current_user.IDUser != db_demande.createur_id and current_user.IDUser != db_demande.destinataire_id:
        raise HTTPException(status_code=403, detail="Vous n'avez pas le droit de mettre à jour cette demande.")
    
    # Mettre à jour les informations de la demande
    for key, value in demande_update.dict().items():
        setattr(db_demande, key, value)
    
    # Mettre à jour les informations des outils associés à la demande
    if demande_update.outils:
        for outil in demande_update.outils:
            db_outil = db.query(models.Outil).filter(models.Outil.NomOutil == outil.NomOutil).first()
            if db_outil:
                contenu_demande = db.query(models.ContenuDemande).filter(
                    models.ContenuDemande.IDDemande == demande_id,
                    models.ContenuDemande.IDOutil == db_outil.IDOutil
                ).first()
                if contenu_demande and outil.Quantite != None :
                    contenu_demande.Quantite = outil.Quantite
                else:
                    nouveau_contenu_demande = models.ContenuDemande(
                        IDDemande=demande_id, IDOutil=db_outil.IDOutil, Quantite=outil.Quantite
                    )
                    db.add(nouveau_contenu_demande)
            else:
                # Créer le nouvel outil s'il n'existe pas
                nouvel_outil = models.Outil(NomOutil=outil.NomOutil, Description=outil.Description)
                db.add(nouvel_outil)
                db.commit()
                db.refresh(nouvel_outil)

                contenu_demande = models.ContenuDemande(
                    IDDemande=demande_id, IDOutil=nouvel_outil.IDOutil, Quantite=outil.Quantite
                )
                db.add(contenu_demande)
    db_demande.DateMiseAjour=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    db.commit()
    db.refresh(db_demande)
    return db_demande


def delete_demande(db: Session, demande_id: int, current_user: models.User):
    # Vérification que l'utilisateur courant est bien le créateur ou le destinataire de la demande
    db_demande = db.query(models.Demande).filter(models.Demande.IDDemande == demande_id).first()
    if not db_demande:
        raise HTTPException(status_code=404, detail="Demande non trouvée.")
    db_notifs = db.query(models.Notification).filter(models.Notification.IDDemandeAssocie == db_demande.IDDemande).all()

    if db_notifs :
        for notif in db_notifs :
            db.delete(notif)
            db.commit()
    
    if current_user.IDUser != db_demande.createur_id and current_user.IDUser != db_demande.destinataire_id and current_user.typeUser==False:
        raise HTTPException(status_code=403, detail="Vous n'avez pas le droit de supprimer cette demande.")
    
    db.delete(db_demande)
    db.commit()
    return {"message":"demande supprime"}

