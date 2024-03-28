from pydantic import BaseModel
from typing import List
from schemas.user import User
from schemas.HistoriqueAction import HistoriqueAction
from schemas.notification import Notification
from schemas.outil import ShowOutil, Outil , GetOutil
import datetime as dt

class OutilDemande(Outil):
        Quantite : int 
        

     
    
class CreateOutilsDemande(BaseModel):
    outils : list[OutilDemande]
    class Config:
        orm_mode = True

class OutilsDemande(CreateOutilsDemande):
    IDDemande : int 
    
    class Config:
        orm_mode = True

        
class ContenuDemandeBase(BaseModel):
    Quantite: int

class ContenuDemandeCreate(ContenuDemandeBase):
    IDDemande: int
    IDOutil: int

class ContenuDemande(ContenuDemandeBase):
    IDContenuDemande: int
    class Config:
        orm_mode = True
#----------------------------------------------------------------        
class ContenuDemandeDelete(BaseModel):
    IDContenuDemande: int
    IDDemande : int
#----------------------------------------------------------------
#-------------Les schemas assoicie a demande--------------------- 
class DemandeBase(BaseModel):
    ObjetDemande: str
    Description: str
 
class DemandeCreate(DemandeBase):
    
    DateDernierDelai : dt.date
    destinataire_email : str
    
    NomSiegeDestinataire :str
    NomServiceDestinataire : str
    NomPosteDestinataire : str
    
    MonService :str
    MonSiege:str
    MonPoste :str
     
#used   
class AfficheDemande(DemandeBase):
    IDDemande: int
    StatueDemande : str
    
    DateCreation: dt.datetime
    DateMiseAjour: dt.datetime
    DateDernieDelia : dt.date  
    
    createur_id: int
    destinataire_email: str
    
    NomSiegeDestinataire :str
    NomServiceDestinataire : str
    NomPosteDestinataire :str
    
    MonService : str
    MonSiege:str
    MonPoste: str
    class Config:
        orm_mode = True
        
#used        
#utilise pour recuper mes demandes
class AfficheEnsomleDemande(BaseModel):
    ObjetDemande: str
    IDDemande: int 
    DateMiseAjour:dt.datetime 
    DateDernieDelai : dt.date
    
    destinataire_email: str
    NomSiegeDestinataire :str
    NomServiceDestinataire : str
    NomPosteDestinataire :str
    StatueDemande : str
    

    class Config:
        orm_mode = True
        
class AfficheDemandeAdmin(BaseModel):
    IDDemande : int
    ObjetDemande: str
    DateMiseAjour:dt.datetime 
    destinataire_email: str
    createur_email :str
    StatueDemande :str
    
    class Config:
        orm_mode = True
            
#used
class ConsulterMaDemande(AfficheDemande):
    outils : list[GetOutil]
    MonTelephone : str
    MonNom :str 
    MonEmail : str
    DestinataireTel : str
    DestinataireNom : str 
    
    class Config:
        orm_mode = True
        
class GetDemandetoUpdate(BaseModel):
    Description : str  
    outils : list[GetOutil]
    class Config:
        orm_mode = True
     
#-------------------------------------------------------------    
class DemandeUpdate(DemandeBase):
    outils : list[OutilDemande]
    class Config:
        orm_mode = True
#used
class GetOutilsDemande(AfficheDemande):
    outils : list[GetOutil]
    class Config:
        orm_mode = True



    
class DemandeWithUsers(AfficheDemande):
    createur: User
    destinataire: User
    utilisateurs: List[User]

