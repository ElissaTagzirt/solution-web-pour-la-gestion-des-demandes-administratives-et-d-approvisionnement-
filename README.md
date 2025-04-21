# Solution Web pour la gestion des demandes administratives et d’approvisionnement

Une application full‑stack destinée à simplifier la création, le suivi et le traitement des demandes administratives et d’approvisionnement au sein d’une organisation.

## 🚀 Fonctionnalités principales

- **Gestion des utilisateurs** (inscription, authentification JWT, rôles administrateur/utilisateur)  
- **Création et suivi des demandes**  
  - Demandes de type administratif ou d’approvisionnement  
  - Statuts (en attente, en cours, validée, etc.)  
  - Attribution à un service, poste ou siège  
  - Echéances et historique des mises à jour  
- **Notifications** en temps réel pour informer les destinataires de nouvelles demandes ou changements de statut  
- **Commentaires et réponses** associées à chaque demande  
- **Module d’admission** pour valider l’accès des nouveaux utilisateurs  
- **Interface Web réactive** développée en React + Tailwind CSS

## 🛠️ Tech Stack

- **Backend** : FastAPI, SQLAlchemy, Pydantic, SQLite (ou PostgreSQL en option)  
- **Frontend** : React (Create React App), Tailwind CSS  
- **Authentification** : JSON Web Tokens (PyJWT / python‑jose)  
- **Notifications** : table `Notifications` orchestrée via FastAPI  
- **Déploiement** : Uvicorn pour le serveur ASGI, npm/yarn pour le frontend


