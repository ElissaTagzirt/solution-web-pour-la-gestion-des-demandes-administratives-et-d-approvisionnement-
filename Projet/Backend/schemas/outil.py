from pydantic import BaseModel
from typing import  Optional

class Outil(BaseModel):
   NomOutil : str
   Description: Optional[str] = None 
class BaseOutil(Outil):
   pass
   
class ShowOutil(Outil):
  IDOutil: int
  class Config ():
        from_attributes = True
        orm_mode = True
  
class GetOutil(Outil):
   Quantite:int
   class Config ():
        from_attributes = True
        orm_mode = True
  