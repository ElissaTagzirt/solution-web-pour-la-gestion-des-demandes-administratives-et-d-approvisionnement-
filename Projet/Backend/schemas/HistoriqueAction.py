from pydantic import BaseModel
from typing import List

class HistoriqueActionBase(BaseModel):
    action: str
    date: str

class HistoriqueActionCreate(HistoriqueActionBase):
    pass

class HistoriqueAction(HistoriqueActionBase):
    IDHistorique: int
    IDDemande: int

    class Config:
        orm_mode = True

