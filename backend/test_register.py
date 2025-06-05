#!/usr/bin/env python3

from app.database import SessionLocal, engine
from app import models, schemas
from passlib.context import CryptContext

# Crear las tablas
models.Base.metadata.create_all(bind=engine)

# Crear contexto de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def test_user_creation():
    db = SessionLocal()
    try:
        # Crear usuario de prueba
        user_data = schemas.UserCreate(
            username="bauti123",
            email="bauti@sportmatch.com",
            password="12345678",
            deportes_preferidos="Fútbol,Tenis",
            descripcion="Amante del deporte",
            foto_url="https://miurl.com/foto.jpg",
            video_url="https://miurl.com/video.mp4",
            age=22,
            location="CABA"
        )
        
        # Verificar si ya existe
        existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
        if existing_user:
            print("❌ Usuario ya existe, eliminando...")
            db.delete(existing_user)
            db.commit()
        
        # Crear nuevo usuario
        hashed_pw = pwd_context.hash(user_data.password)
        new_user = models.User(
            username=user_data.username,
            email=user_data.email,
            password=hashed_pw,
            deportes_preferidos=user_data.deportes_preferidos,
            descripcion=user_data.descripcion,
            foto_url=user_data.foto_url,
            video_url=user_data.video_url,
            age=user_data.age,
            location=user_data.location
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print("✅ Usuario creado exitosamente!")
        print(f"ID: {new_user.id}")
        print(f"Username: {new_user.username}")
        print(f"Email: {new_user.email}")
        print(f"Deportes: {new_user.deportes_preferidos}")
        print(f"Descripción: {new_user.descripcion}")
        print(f"Foto URL: {new_user.foto_url}")
        print(f"Edad: {new_user.age}")
        print(f"Ubicación: {new_user.location}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("🧪 Probando creación de usuario...")
    test_user_creation() 