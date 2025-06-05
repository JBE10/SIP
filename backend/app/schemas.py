from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    username: str
    deportes_preferidos: Optional[str] = None
    descripcion: Optional[str] = None
    foto_url: Optional[str] = None
    video_url: Optional[str] = None
    age: Optional[int] = None
    location: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    deportes_preferidos: Optional[str] = None
    descripcion: Optional[str] = None
    foto_url: Optional[str] = None
    video_url: Optional[str] = None
    age: Optional[int] = None
    location: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    deportes_preferidos: Optional[str] = None
    descripcion: Optional[str] = None
    foto_url: Optional[str] = None
    video_url: Optional[str] = None
    age: Optional[int] = None
    location: Optional[str] = None

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

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
