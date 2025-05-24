from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL de tu frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DB Setup ---
conn = sqlite3.connect('match.db', check_same_thread=False)
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user TEXT NOT NULL,
    to_user TEXT NOT NULL
)''')
c.execute('''CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1 TEXT NOT NULL,
    user2 TEXT NOT NULL
)''')
conn.commit()

# --- Models ---
class LikeRequest(BaseModel):
    from_user: str
    to_user: str

class MatchResponse(BaseModel):
    match: bool
    users: list[str] = []

# --- Endpoints ---
@app.post('/like', response_model=MatchResponse)
def like_user(like: LikeRequest):
    # Guardar el like
    c.execute('INSERT INTO likes (from_user, to_user) VALUES (?, ?)', (like.from_user, like.to_user))
    conn.commit()
    # Verificar si hay match
    c.execute('SELECT 1 FROM likes WHERE from_user=? AND to_user=?', (like.to_user, like.from_user))
    if c.fetchone():
        # Crear match si no existe
        c.execute('SELECT 1 FROM matches WHERE (user1=? AND user2=?) OR (user1=? AND user2=?)',
                  (like.from_user, like.to_user, like.to_user, like.from_user))
        if not c.fetchone():
            c.execute('INSERT INTO matches (user1, user2) VALUES (?, ?)', (like.from_user, like.to_user))
            conn.commit()
        return MatchResponse(match=True, users=[like.from_user, like.to_user])
    return MatchResponse(match=False)

@app.get('/matches/{username}', response_model=list)
def get_matches(username: str):
    c.execute('SELECT user1, user2 FROM matches WHERE user1=? OR user2=?', (username, username))
    matches = c.fetchall()
    result = []
    for u1, u2 in matches:
        other = u2 if u1 == username else u1
        result.append(other)
    return result 