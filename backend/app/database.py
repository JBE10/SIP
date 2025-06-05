from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()  # Carga variables desde .env

# URL de PostgreSQL de Railway
DATABASE_URL = "postgresql://postgres:SjPLUpHFZzydYEYfqCPKWbWIrPuJkOyi@shuttle.proxy.rlwy.net:17388/railway"

# También cargar desde .env si existe (para sobrescribir)
env_database_url = os.getenv("DATABASE_URL")
if env_database_url:
    DATABASE_URL = env_database_url

# Logging para verificar conexión
print(f"🔗 DATABASE_URL cargada: {DATABASE_URL[:30]}..." if DATABASE_URL else "❌ DATABASE_URL no encontrada")

# Control de entorno - forzar PostgreSQL de Railway
USE_LOCAL_DB = False  # Forzar uso de PostgreSQL

if USE_LOCAL_DB or not DATABASE_URL:
    # Usar SQLite local
    LOCAL_DATABASE_URL = "sqlite:///./sportmatch.db"
    print(f"🔄 Usando SQLite local: {LOCAL_DATABASE_URL}")
    engine = create_engine(LOCAL_DATABASE_URL, connect_args={"check_same_thread": False})
elif DATABASE_URL.startswith("postgresql"):
    # Conectar a Railway PostgreSQL
    print(f"🚀 Conectando a Railway PostgreSQL: {DATABASE_URL[:50]}...")
    engine = create_engine(DATABASE_URL)
else:
    # Fallback a SQLite si DATABASE_URL no es reconocida
    LOCAL_DATABASE_URL = "sqlite:///./sportmatch.db"
    print(f"⚠️ DATABASE_URL no reconocida, usando SQLite: {LOCAL_DATABASE_URL}")
    engine = create_engine(LOCAL_DATABASE_URL, connect_args={"check_same_thread": False})

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
