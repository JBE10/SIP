# Backend Python - Algoritmo de Match tipo Tinder

Este microservicio implementa la lógica de likes y matches usando FastAPI y SQLite.

## Instalación

1. Instala las dependencias:

```bash
pip install -r requirements.txt
```

2. Ejecuta el servidor:

```bash
uvicorn main:app --reload
```

## Endpoints

- `POST /like`  
  Recibe `{ "from_user": "usuario1", "to_user": "usuario2" }`  
  Si hay match, responde `{ "match": true, "users": ["usuario1", "usuario2"] }`  
  Si no, responde `{ "match": false, "users": [] }`

- `GET /matches/{username}`  
  Devuelve una lista de usuarios con los que el usuario tiene match.

## Notas
- La base de datos es un archivo SQLite llamado `match.db`.
- Puedes modificar la lógica según tus necesidades. 