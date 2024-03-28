from pydantic import BaseModel, BaseConfig
from datetime import datetime
from models.models import Notification as NotifModel

class NotificationBase(BaseModel):
    ContenuNotif: str
    IDDemandeAssocie: int
    IDUserDestine: int

class Notification(NotificationBase):
    pass

class ShowNotification(NotificationBase):
    IDNotification: int
    DateEnvoi: datetime
    EtatNotif :str

    class Config:
        orm_mode = True
   
class notificationSchema(BaseModel):
    IDNotification: int
    IDDemandeAssocie: int
    IDUserDestine: int
    ContenuNotif: str
    EtatNotif: str 
    DateEnvoi: datetime 
    class Config(BaseConfig):
        arbitrary_types_allowed = True
  

class GetNotification(BaseModel):
    NewNotifs : list[notificationSchema]
    LastNotifs : list[notificationSchema]
     