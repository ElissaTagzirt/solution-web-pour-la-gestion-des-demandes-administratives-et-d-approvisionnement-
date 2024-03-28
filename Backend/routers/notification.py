from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas import notification as notif_schema
from db.Database import get_db
from methods import notification as notif_methods
from routers.oauth2 import get_current_user
from schemas.user import User

router = APIRouter(
    prefix='/notifications',
    tags=['Notifications']
)




@router.get('/GetNotifications',
           # response_model=notif_schema.GetNotification
            )
def get_notifications_for_user( db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return notif_methods.get_all_notifications_user(db=db ,  current_user=current_user)


@router.put('/SetNotificationlu')
def SetNotificationUser(db:Session = Depends(get_db), current_user : User = Depends(get_current_user)):
    return notif_methods.set_all_notifications_enAttente_versConsulter(db=db, current_user=current_user)
    
@router.get('/{id_notification}', response_model=notif_schema.ShowNotification)
def Get_notifications_by_id(id_notification:int , db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return notif_methods.get_notification_by_id(db=db, id_notification =id_notification,current_user=current_user)

@router.post('/', response_model=notif_schema.ShowNotification)
def create_new_notification(notification: notif_schema.Notification, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return notif_methods.create_notification(db=db, notification=notification)

@router.put("/notifications/update_status/{notification_id}/{new_status}")
def update_notification(
    notification_id: int, new_status: int, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return notif_methods.update_notification_status(db=db, notification_id=notification_id, new_status=new_status ,current_user = current_user)

@router.get("/NbNotification/")
def Get_Nb_Notification(db:Session= Depends(get_db) , current_user : User = Depends(get_current_user)):
    return notif_methods.get_Nb_Notification(db=db,current_user=current_user)