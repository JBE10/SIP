from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    username: str
    deportes_preferidos: Optional[str] = None
    descripcion: Optional[str] = None
    foto_url: Optional[str] = None
    video_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    deportes_preferidos: Optional[str] = None
    descripcion: Optional[str] = None
    foto_url: Optional[str] = None
    video_url: Optional[str] = None

    class Config:
        from_attributes = True
