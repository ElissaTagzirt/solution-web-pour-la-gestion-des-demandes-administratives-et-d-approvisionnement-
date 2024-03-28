from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, TEXT, DateTime, Table ,Date
from db.Database import Base
from sqlalchemy.orm import relationship
import datetime as dt
from sqlalchemy import Enum


STATUES_NOTIFS = ("En attente", "Consulter", "Archivée")
STATUES_DEMANDE_ADMISSION = ("En attente", "Validée")
STATUES_DEMANDE = ("En attente", "En cours", "Validée", "Archivée Valider", "Archivée Annuler","Annuler","inatteignable")
                          # 0        1            2               #  3                 #4            #5            #6
class Poste(Base):
    __tablename__ ='Postes'
    IDPoste = Column(Integer, primary_key=True, index=True)
    NomPoste = Column(String, unique=True, index=True)
    Description = Column(TEXT)
    relations = relationship('ServiceSiegePosteUser', back_populates='poste')
class Siege(Base):
    __tablename__ = 'Sieges'

    IDSiege     = Column(Integer, primary_key=True, index=True)
    NomSiege    = Column(String, unique=True, index=True)
    Description = Column(TEXT)
    relations = relationship('ServiceSiegePosteUser', back_populates='siege')
    
class Service(Base):
    __tablename__ = 'Services'

    IDService   = Column(Integer, primary_key=True, index=True)
    NomService  = Column(String,unique=True, index=True)
    Description = Column(TEXT)
    relations = relationship('ServiceSiegePosteUser', back_populates='service')
    
class ServiceSiegePosteUser(Base):
    __tablename__ = 'ServiceSiegePosteUser'

    IDRelation  = Column(Integer, primary_key=True, index=True)
    IDService   = Column(Integer, ForeignKey('Services.IDService'))
    IDSiege     = Column(Integer, ForeignKey('Sieges.IDSiege'))
    IDUser      = Column(Integer, ForeignKey('Users.IDUser'))
    IDPoste     = Column(Integer,ForeignKey('Postes.IDPoste'))
    AnneeDebutTravail = Column(Date, nullable=True)
    AnneeFinTravail   = Column(Date, nullable=True)

    service = relationship('Service', back_populates='relations')
    siege   = relationship('Siege', back_populates='relations')
    user    = relationship('User', back_populates='relations')
    poste   = relationship('Poste', back_populates='relations')
    
    
demandes_utilisateurs = Table('DemandesUtilisateurs', Base.metadata,
    Column('IDDemande', Integer, ForeignKey('Demandes.IDDemande'), primary_key=True),
    Column('IDUser', Integer, ForeignKey('Users.IDUser'), primary_key=True)
)

class Reponse(Base):
    __tablename__ = 'Reponses'

    IDReponse = Column(Integer, primary_key=True, index=True)
    Contenu       = Column(TEXT)
    DateCreation  = Column(DateTime, default=dt.datetime.utcnow)
    IDUser        = Column(Integer, ForeignKey('Users.IDUser'))
    IDDemande     = Column(Integer, ForeignKey('Demandes.IDDemande'))  # Ajoutez cette clé étrangère
    createur = relationship('User', foreign_keys=[IDUser], back_populates='reponses_crees')
    reponses_demande  = relationship('Demande', foreign_keys=[IDDemande], back_populates='reponses')

class Demande(Base):
    
    
    __tablename__ = 'Demandes'
 

    IDDemande       = Column(Integer, primary_key=True, index=True)
    ObjetDemande    = Column(TEXT)
    Description     = Column(TEXT)
    
    StatueDemande   = Column(String, default=STATUES_DEMANDE[0])
    DateCreation    = Column(DateTime, default=dt.datetime.utcnow)
    DateMiseAjour   = Column(DateTime, default=dt.datetime.utcnow)
    DateDernieDelai = Column(Date, default=dt.date.today())
    
    createur_id     = Column(Integer, ForeignKey('Users.IDUser'))
    destinataire_id = Column(Integer, ForeignKey('Users.IDUser'))
    
    destinataire_email = Column(String, ForeignKey('Users.email'))
    NomServiceDestinataire = Column( String, ForeignKey('Services.NomService'))
    NomSiegeDestinataire =Column( String, ForeignKey('Sieges.NomSiege'))
    NomPosteDestinataire = Column( String, ForeignKey('Postes.NomPoste'))
    
    MonService         = Column( String, ForeignKey('Services.NomService'))
    MonSiege           = Column( String, ForeignKey('Sieges.NomSiege'))
    MonPoste           = Column( String, ForeignKey('Postes.NomPoste'))
    
    createur           = relationship('User', foreign_keys=[createur_id], back_populates='demandes_creees')
    destinataire       = relationship('User', foreign_keys=[destinataire_id], back_populates='demandes_recues')
    #associe au utilisateur et leur demande
    utilisateurs       = relationship('User', secondary=demandes_utilisateurs, back_populates='demandes')
    # Relation avec les contenus associés à aux commentaires
    reponses       = relationship('Reponse', back_populates='reponses_demande')
    # Relation avec les contenus associés à la demande
    contenu            = relationship('ContenuDemande', back_populates='Contenu_demande')
    #Notification de la demande 
    Notifs = relationship('Notification', back_populates='Notifs_demande')
    
   
class User(Base):
    __tablename__ = 'Users'
    
    IDUser            = Column(Integer,unique=True, primary_key=True, index=True)
    hashed_password   = Column(String)
    typeUser          = Column(Boolean,default=False)
    name              = Column(TEXT, index=True)
    email             = Column(String, unique=True, index=True)
    dateNaissance     =  Column(Date)
    numeroDeTelephone = Column(Integer)
    adresse           = Column(TEXT)
    IDAdmin           = Column(Integer, ForeignKey('Users.IDUser'))
    # pour pouvoir recupere tout les demande cree
    demandes_creees      = relationship('Demande', foreign_keys=[Demande.createur_id], back_populates='createur')
    # pour pouvoir recupere tout les demande recus
    demandes_recues      = relationship('Demande', foreign_keys=[Demande.destinataire_id], back_populates='destinataire')
    demandes             = relationship('Demande', secondary=demandes_utilisateurs, back_populates='utilisateurs')
    # pour pouvoir recupere tout les commentaire qui il a cree 
    reponses_crees   = relationship('Reponse', foreign_keys=[Reponse.IDUser], back_populates='createur')
    #les notification e users
    Notifs = relationship('Notification', back_populates='Utilisateur')
    relations = relationship('ServiceSiegePosteUser', back_populates='user')
class Outil(Base):
    __tablename__ = 'Outils'

    IDOutil     = Column(Integer, primary_key=True, index=True)
    NomOutil    = Column(String, index=True , unique=True)
    Description = Column(TEXT)
    contenu =  relationship('ContenuDemande', back_populates='outil')

class ContenuDemande(Base):
    __tablename__ = 'ContenuDemandes'

    IDContenuDemande = Column(Integer, primary_key=True, index=True)
    Quantite         = Column(Integer)
    IDDemande        = Column(Integer, ForeignKey('Demandes.IDDemande'))
    IDOutil          = Column(Integer, ForeignKey('Outils.IDOutil'))
    NomOutil         = Column(String)
    DescriptionUser  = Column(String )
    Contenu_demande = relationship('Demande',foreign_keys = [IDDemande], back_populates='contenu')
    outil   = relationship('Outil',foreign_keys = [IDOutil] , back_populates='contenu')

class Notification(Base):
    __tablename__    = 'Notifications'

    IDNotification   = Column(Integer, primary_key=True, index=True)
    IDDemandeAssocie = Column(Integer, ForeignKey('Demandes.IDDemande'))
    IDUserDestine    = Column(Integer, ForeignKey('Users.IDUser'))
    ContenuNotif     = Column(TEXT)
    EtatNotif        = Column(String, default=STATUES_NOTIFS[0])
    DateEnvoi       = Column(DateTime, default=dt.datetime.utcnow)
    Utilisateur = relationship('User', foreign_keys = [IDUserDestine],back_populates='Notifs') 
    Notifs_demande     = relationship('Demande',foreign_keys = [IDDemandeAssocie], back_populates='Notifs') 
    

class DemandeAdminition(Base):  
    __tablename__    = 'DemandeAdminitions'

    IDDemandeAdminition   = Column(Integer, primary_key=True, index=True)
    hashed_password       = Column(String)
    typeUser              = Column(Boolean,default=False)
    name                  = Column(TEXT, index=True)
    email                 = Column(String, unique=True, index=True)
    numeroDeTelephone     = Column(Integer)
    adresse               = Column(TEXT) 
    dateNaissance     =  Column(Date)
    StatueDemande   = Column(String, default=STATUES_DEMANDE_ADMISSION[0])
