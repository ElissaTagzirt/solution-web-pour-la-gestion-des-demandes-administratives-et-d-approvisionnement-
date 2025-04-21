from fastapi import FastAPI
from models import models
from db import Database
from routers import user 
from routers import siege , travail
from routers import outil , Admin , poste , Reponse
from routers import service , auth , demande , notification , DemandeAdmissionUser
from fastapi.middleware.cors import CORSMiddleware
import logging
app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Remplacez par l'URL de votre frontend en développement
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logging.basicConfig(level=logging.DEBUG)

models.Base.metadata.create_all(bind=Database.engine)
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI"}


app.include_router(user.router)
app.include_router(siege.router)
app.include_router(outil.router)
app.include_router(service.router)
app.include_router(auth.router)
app.include_router(demande.router)
app.include_router(Admin.router)
app.include_router(poste.router)
app.include_router(travail.router)
app.include_router(notification.router)
app.include_router(Reponse.router)
app.include_router(DemandeAdmissionUser.router)

