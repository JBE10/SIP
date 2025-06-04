from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Usar SQLite en lugar de MySQL
DATABASE_URL = "sqlite:///./sportmatch.db"

# Crear el motor de conexión
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

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
