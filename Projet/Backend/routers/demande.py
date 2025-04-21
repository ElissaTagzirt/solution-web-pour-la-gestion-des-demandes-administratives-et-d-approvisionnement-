from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from methods import demande  as methods
from schemas import demande as   schemas
from models import models
from typing import List
from db.Database import get_db
from routers.oauth2 import get_current_user

router = APIRouter(
     tags=['Demande'],
     prefix='/Demandes',
)

# Créer une nouvelle demande
@router.post("/createdemande/",response_model=schemas.AfficheDemande)
def Create_new_demande(demande: schemas.DemandeCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return methods.create_demande(db, demande, current_user)


#ajoute des outils a la demande cree
@router.post("/demandes/{demande_id}/SelectOutils", response_model=schemas.CreateOutilsDemande)
def Create_demande_with_outils(
    demande_id : int,
    demande_with_outils: schemas.CreateOutilsDemande,  # Inclut les outils
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)):
   
    return methods.Ajouter_outils_nouvelle_demande(IDDemande=demande_id,db=db,demande_with_outils=demande_with_outils ,current_user=current_user)     


@router.put("/AnnulerDemande/{demande_id}")
def Annuler_Demande (demande_id : int , 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    ):
   
    return methods.Annuler_Demande(demande_id = demande_id,db=db, current_user=current_user)


@router.put("/ArchiverDemande/{demande_id}")
def Archiver_Demande (demande_id : int , 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    ):
    methods.archiver_Demande(demande_id = demande_id,db=db, current_user=current_user)

@router.get("/GetDemandetoUpdate/{demande_id}", response_model=schemas.GetDemandetoUpdate)
def Get_Demande_toUpdate(demande_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return methods.get_Demande_toUpdate(db=db , demande_id=demande_id , current_user =current_user)


@router.put("/SetUpdateDemande/{demande_id}")
def Set_Update_demande(
    demande_id: int,
    demande_update: schemas.GetDemandetoUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
     return methods.set_update_demande(db=db , current_user=current_user , demande_id = demande_id , demande_update =demande_update)
 
 
 # recuppere tout les demandes cree par l'utilisateur current
@router.get("/MesdemandesCreees/", response_model=List[schemas.AfficheEnsomleDemande])
def Get_all_demande_user_sans_outils(db: Session= Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return methods.get_all_demande_user_sans_outils(db=db,current_user=current_user)


#recupere tout les demande recues pour un utilisateur
@router.get("/MesdemadesRecues/",response_model=List[schemas.AfficheEnsomleDemande])
def Get_all_demande_user_sans_outils_recues(db:Session=Depends(get_db), current_user :models.User=Depends(get_current_user)):
    return methods.get_all_demande_user_sans_outils_recues(db=db, current_user=current_user)
 
 
#recupere une demande par son id
@router.get("/Getdemande/{demande_id}", 
            response_model=schemas.ConsulterMaDemande
            )
def Get_demande_by_id(demande_id: int,db: Session = Depends(get_db) , current_user: models.User = Depends(get_current_user)):
                    
    demande = methods.get_demande_by_id(db, demande_id, current_user)
    if not demande:
        raise HTTPException(status_code=404, detail="Demande non trouvée.")
    return demande

#changer le statue de la demande 
@router.put("/ChangeStatueDemande/{demande_id}/{numero_statue}")  
def Change_Statue_demande( numero_statue :int ,demande_id : int ,db: Session = Depends(get_db) , current_user :models.User=Depends(get_current_user) ):
                           
  return  methods.change_statue_demande(db=db , demande_id = demande_id , numero_statue =numero_statue , current_user=current_user)  
#--------------------------------------------------------------------------------------------------------------------------------------------------------------
# Met à jour les informations d'une demande
@router.put("/Updatedemandes/{demande_id}", response_model=schemas.DemandeUpdate)
def Update_infos_demande(
    demande_id: int,
    demande_update: schemas.DemandeUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return methods.update_demande(db=db,demande_id=demande_id, demande_update=demande_update, current_user=current_user)

# Supprime une demande
@router.delete("/Delete/{demande_id}")
def Delete_demande(
    demande_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return methods.delete_demande(db, demande_id, current_user)

#pour l'admin recupere tout les demande existante non archivie
@router.get("/UsersDemandes/", response_model=List[schemas.AfficheDemandeAdmin])
def get_All_demandes_admin(db: Session = Depends(get_db) , current_user:models.User = Depends(get_current_user)):
  if current_user.typeUser == False :
    raise HTTPException(status_code=403, detail="Vous n'avez pas le droit d'effectuer cette action")
  demandes = db.query(models.Demande).filter(models.Demande.StatueDemande != models.STATUES_DEMANDE[4], models.Demande.StatueDemande != models.STATUES_DEMANDE[3] ).all()
  demande_return = []
  for demande in demandes :
      user = db.query(models.User).filter(models.User.IDUser==demande.createur_id ).first()
      o = schemas.AfficheDemandeAdmin(
          IDDemande=demande.IDDemande,
          ObjetDemande=demande.ObjetDemande,
          DateMiseAjour=demande.DateMiseAjour,
          destinataire_email=demande.destinataire_email,
          StatueDemande=demande.StatueDemande,
          createur_email = user.email
      )  
      demande_return.append(o)
  return demande_return  

#pour l'admin recupere tout les demande existante non archivie
@router.get("/UsersDemandesArchive/", response_model=List[schemas.AfficheDemandeAdmin])
def get_demandes_archivies_admin(db: Session = Depends(get_db) , current_user:models.User = Depends(get_current_user)):
  if current_user.typeUser == False :
    raise HTTPException(status_code=403, detail="Vous n'avez pas le droit d'effectuer cette action")
  demandes = db.query(models.Demande).filter(models.Demande.StatueDemande.in_([models.STATUES_DEMANDE[3], models.STATUES_DEMANDE[4]])).all()
  demande_return = []
  for demande in demandes :
      user = db.query(models.User).filter(models.User.IDUser==demande.createur_id ).first()
      o = schemas.AfficheDemandeAdmin(
          IDDemande=demande.IDDemande,
          ObjetDemande=demande.ObjetDemande,
          DateMiseAjour=demande.DateMiseAjour,
          destinataire_email=demande.destinataire_email,
          StatueDemande=demande.StatueDemande,
          createur_email = user.email
      )  
      demande_return.append(o)
  return demande_return    
  



