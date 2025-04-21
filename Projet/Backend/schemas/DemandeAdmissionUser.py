from pydantic import BaseModel
from datetime import date

class DemandeAdminitionBase(BaseModel):
    hashed_password: str
    name: str
    email: str
    numeroDeTelephone: str
    adresse: str
    dateNaissance: date
    

class DemandeAdminitionCreate(DemandeAdminitionBase):
    pass



class DemandeAdminition(BaseModel):
    IDDemandeAdminition: int
    name: str
    email: str
    numeroDeTelephone: str
    adresse: str
    dateNaissance: date
    
    class Config:
        orm_mode = True

class DemandeAdminitionUpdate(DemandeAdminition):
    pass