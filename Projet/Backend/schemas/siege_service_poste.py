from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class Siege(BaseModel):
    NomSiege : str
    Description: Optional[str] = None 

class ShowSiegeUser(BaseModel):
    IDSiege :int 
    NomSiege : str
    Description : str
    class Config ():
        from_attributes = True
        orm_mode = True
 
class UpdateSiege(BaseModel):
    NomSiege:str
    Description : str   
class ShowSiege(Siege):
  IDSiege: int
  class Config ():
        from_attributes = True
        orm_mode = True
#---------------------------- Schemas  Service -------------------------        
class Service(BaseModel):
    NomService : str
    Description: Optional[str] = None 
   
class ShowService(Service):
  IDService: int
  class Config ():
        from_attributes = True
        orm_mode = True
        
class ShowServiceUser(BaseModel):
    IDService :int 
    NomService : str
    
    class Config ():
        from_attributes = True
        orm_mode = True

class UpdateService(BaseModel):
    Description : str  
    NomService : str        
#------------------------- Schemas Poste ----------------------------------        
class Poste(BaseModel):
  NomPoste : str
  Description : Optional[str]=None
  
class ShowPoste(Poste):
  IDPoste : int
  class Config():
    from_attributes = True
    orm_mode = True            
    
class ShowPosteUser(BaseModel):
    IDPoste :int 
    NomPoste : str
    class Config ():
        from_attributes = True
        orm_mode = True
 

class UpdatePoste(BaseModel):
    Description : str 
    NomPoste : str  

    
    
#---------------------- Entite travail----------------------------    
 
class TravailBase(BaseModel):
    IDService: int
    IDSiege: int
    IDUser: int
    IDPoste: int
    AnneeDebutTravail: date
       
class TravailCreate(TravailBase):
    pass

class TravailUpdate(BaseModel):
    IDRelation: int
    AnneeFinTravail: date
    class Config:
        orm_mode = True
        arbitrary_types_allowed = True 
    

class Update(BaseModel):
    IDRelation: int
    datedepart : date
    
class TravailNames(BaseModel):
    IDRelation: int
    NomService: str
    NomSiege: str
    NomUser: str
    NomPoste: str
    AnneeFinTravail: Optional[str] = None 
    AnneeDebutTravail: str
    class Config:
        orm_mode = True
        arbitrary_types_allowed = True 
    
           
    
     
class Travail(TravailBase):
    AnneeFinTravail: Optional[str] = None 
    class Config:
        orm_mode = True
    