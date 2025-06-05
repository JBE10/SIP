from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models
from . import schemas
from . import auth
from . import database
from .database import Base, engine
import app.models  # Importar para que registre las tablas
from fastapi.staticfiles import StaticFiles
import os
import uuid
import shutil

app = FastAPI()

# Crear las tablas en la base de datos - CON LOGGING
print("🔄 Conectando a la base de datos...")
try:
    print("📋 Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas exitosamente!")
except Exception as e:
    print(f"❌ Error creando tablas: {e}")

# CORS para permitir conexión desde Vercel y Railway
origins = [
    "https://sportsmatch.vercel.app",
    "https://sip-production.up.railway.app",
    "http://localhost:3000",
    "http://localhost:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rutas de autenticación
app.include_router(auth.router, prefix="/auth", tags=["auth"])

# Endpoint raíz para verificar que la API funciona
@app.get("/")
def root():
    return {
        "message": "🏆 SportMatch API funcionando correctamente", 
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "register": "/auth/register", 
            "login": "/auth/login",
            "me": "/users/me"
        }
    }

# Endpoint de health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

# Rutas de usuarios
@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user

@app.put("/users/me", response_model=schemas.User)
def update_user(
    user_update: schemas.UserUpdate,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Actualizar campos
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user

# Rutas de matches
@app.get("/matches", response_model=List[schemas.User])
def get_matches(
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Aquí iría la lógica para obtener los matches
    # Por ahora, devolvemos una lista vacía
    return []

# Rutas de archivos
@app.post("/users/upload-photo")
async def upload_photo(
    file: UploadFile = File(...),
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar que sea una imagen
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos de imagen")
    
    # Verificar tamaño (5MB máximo)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="El archivo es demasiado grande. Máximo 5MB")
    
    # Generar nombre único para el archivo
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"app/static/uploads/{unique_filename}"
    
    # Guardar el archivo
    with open(file_path, "wb") as buffer:
        buffer.write(content)
    
    # Actualizar la URL de la foto en la base de datos
    photo_url = f"http://localhost:8000/static/uploads/{unique_filename}"
    db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
    db_user.foto_url = photo_url
    db.commit()
    db.refresh(db_user)
    
    return {"message": "Foto subida exitosamente", "foto_url": photo_url}

# Asegúrate de que la carpeta exista
os.makedirs("app/static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
