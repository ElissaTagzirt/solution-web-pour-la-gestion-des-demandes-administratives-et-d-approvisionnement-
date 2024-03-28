from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./bdd.db" #for sqlite database

#SQLALCHEMY_DATABASE_URL = 'postgresql+psycopg2://postgres:14171417@localhost:5433/tpigl' # Postgresql database
#SQLALCHEMY_DATABASE_URL = 'postgresql+psycopg2://postgres:imed2002@localhost:5432/tpigl' # Postgresql database




engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()