from sqlalchemy.orm import Session
from models.models import STATUES_NOTIFS as STATUES_NOTIFS
from models.models import Notification as NotificationModel
from models.models import User as UserModel
from schemas import notification as NotificationSchema
from datetime import datetime
from sqlalchemy import func
from fastapi import HTTPException

def create_notification(db: Session, notification: NotificationSchema.NotificationBase):
    db_notification = NotificationModel(DateEnvoi=datetime.utcnow(),
                                        IDDemandeAssocie = notification.IDDemandeAssocie,
                                        IDUserDestine = notification.IDUserDestine,
                                        ContenuNotif = notification.ContenuNotif)
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

                                        
def get_notification_by_id(db: Session, id_notification: int,current_user: UserModel):
    notif =db.query(NotificationModel).filter(NotificationModel.IDNotification == id_notification).first()
    if  notif.IDUserDestine != current_user.IDUser :
        return None
    else :return notif
 
 
def set_all_notifications_enAttente_versConsulter(db: Session, current_user: UserModel):
    new_notifs = db.query(NotificationModel).filter(
        NotificationModel.IDUserDestine == current_user.IDUser,
        NotificationModel.EtatNotif == STATUES_NOTIFS[0]
    ).all()   
    
    for notif in new_notifs :
        update_notification_status(db=db,current_user=current_user ,notification_id=notif.IDNotification, new_status=1)
    return {"message": "Notification status updated successfully"}   
        
def get_all_notifications_user(db: Session, current_user: UserModel):
    
    new_notifs = db.query(NotificationModel).filter(
        NotificationModel.IDUserDestine == current_user.IDUser,
        NotificationModel.EtatNotif == STATUES_NOTIFS[0]
    ).all()
    
    last_notifs = db.query(NotificationModel).filter(
        NotificationModel.IDUserDestine == current_user.IDUser,
        NotificationModel.EtatNotif == STATUES_NOTIFS[1]
    ).all()
    
    new_notifs_schemas = []
    if new_notifs:
        for notif in new_notifs:
            o = NotificationSchema.notificationSchema(
                IDNotification=notif.IDNotification,
                IDDemandeAssocie=notif.IDDemandeAssocie,
                IDUserDestine=notif.IDUserDestine,
                ContenuNotif=notif.ContenuNotif,
                EtatNotif=notif.EtatNotif,
                DateEnvoi=notif.DateEnvoi
            )
            new_notifs_schemas.append(o)

    last_notifs_schemas = []
    if last_notifs :
        for lastnotif in last_notifs:
    
            o = NotificationSchema.notificationSchema(
                IDNotification=lastnotif.IDNotification,
                IDDemandeAssocie=lastnotif.IDDemandeAssocie,
                IDUserDestine=lastnotif.IDUserDestine,
                ContenuNotif=lastnotif.ContenuNotif,
                EtatNotif=lastnotif.EtatNotif,
                DateEnvoi=lastnotif.DateEnvoi
            )
            last_notifs_schemas.append(o)
    
    return NotificationSchema.GetNotification(NewNotifs=new_notifs_schemas, LastNotifs=last_notifs_schemas)


def update_notification_status(db: Session,current_user : UserModel, notification_id: int, new_status: int):
    if not current_user :
         raise HTTPException(status_code=401, detail="action non autorisée")

    # Vérifiez si la notification existe
    notification = db.query(NotificationModel).filter(NotificationModel.IDNotification == notification_id).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    # Vérifiez si new_status est valide (1 ou 2 par exemple)
    if new_status not in [1, 2]:
        raise HTTPException(status_code=400, detail="Invalid new_status")

    # Mettez à jour l'état de la notification
    notification.EtatNotif = STATUES_NOTIFS[new_status]

    # Enregistrez les modifications dans la base de données
    db.commit()

    return {"message": "Notification status updated successfully"}

def get_Nb_Notification(db : Session,current_user:UserModel):
    return db.query(func.count(NotificationModel.IDNotification)).filter(
    NotificationModel.IDUserDestine == current_user.IDUser,
    NotificationModel.EtatNotif == STATUES_NOTIFS[0]).scalar()