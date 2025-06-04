from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()  # Carga variables desde .env

DATABASE_URL = os.getenv("DATABASE_URL")

# Logging para verificar conexión
print(f"🔗 DATABASE_URL cargada: {DATABASE_URL[:30]}..." if DATABASE_URL else "❌ DATABASE_URL no encontrada")

# Si no hay DATABASE_URL o falla PostgreSQL, usar SQLite local para testing
if not DATABASE_URL or DATABASE_URL.startswith("postgresql"):
    # Para testing local, usar SQLite
    LOCAL_DATABASE_URL = "sqlite:///./sportmatch.db"
    print(f"🔄 Usando SQLite local para testing: {LOCAL_DATABASE_URL}")
    engine = create_engine(LOCAL_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

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
