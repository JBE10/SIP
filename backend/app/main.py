from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import models, schemas, auth, database
from fastapi.middleware.cors import CORSMiddleware

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Configurar CORS (para poder conectar con React luego)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción limitá esto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencia para obtener sesión de base de datos
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def preload_demo_user():
    db = database.SessionLocal()
    from .auth import get_password_hash

    demo_email = "demo@example.com"

    if not db.query(models.User).filter_by(email=demo_email).first():
        demo_user = models.User(
            username="bauti_demo",
            email=demo_email,
            password=get_password_hash("123456"),
            deportes_preferidos="boxeo, gym",
            descripcion="Cuenta precargada con imagen de Cloudinary",
            foto_url="https://res.cloudinary.com/dqfegkypt/image/upload/2d443485-5f96-4d4c-9d68-6d406771f00b.jpg"
        )
        db.add(demo_user)
        db.commit()

    db.close()

# ✔️ Registro
@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        deportes_preferidos=user.deportes_preferidos,
        descripcion=user.descripcion,
        foto_url=user.foto_url,
        video_url=user.video_url
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ✔️ Login
@app.post("/login")
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not auth.verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Generate JWT token
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# ✔️ Obtener usuario actual
@app.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
