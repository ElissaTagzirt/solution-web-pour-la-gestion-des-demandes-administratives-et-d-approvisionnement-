from pydantic import BaseModel
from datetime import datetime

class ResponseBase(BaseModel):
    contenu: str
    IDDeamnde :int
     

class ResponseCreate(ResponseBase):
    pass

class ShowResponse(BaseModel):
    IDReponse : int 
    DateCreation : datetime
    Contenu :str

    class Config:
        orm_mode = True

class UpdateResponse(BaseModel):
    contenu : str
    IDResponse : int
    
