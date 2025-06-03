from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ⚠️ Asegurate de que el puerto 3307 es el que usaste en Docker
DATABASE_URL = "mysql+pymysql://root:admin123@localhost:3307/sportmatch_db"

# Crear el motor de conexión
engine = create_engine(DATABASE_URL, echo=True)

# Crear sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Obtener una sesión de base de datos (usado con Depends)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
