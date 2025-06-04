# SportMatch - Encuentra Compañeros Deportivos

Una aplicación web moderna para encontrar compañeros deportivos en tu área.

## Descripción

SportMatch es una plataforma que conecta a personas con intereses deportivos similares en Buenos Aires. La aplicación permite a los usuarios crear perfiles, especificar sus deportes preferidos y encontrar compañeros para practicar deportes.

## Características Principales

- 🔐 Autenticación de usuarios
- 👤 Perfiles personalizables
- 🎯 Sistema de swipe para matching
- 💬 Chat en tiempo real (simulado)
- 🌓 Modo oscuro/claro
- 📱 Diseño responsive

## Tecnologías Utilizadas

### Frontend
- **Framework**: Next.js 15.2.4
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: Shadcn UI
- **Animaciones**: Framer Motion
- **Estado**: React Context

### Backend
- **Framework**: FastAPI
- **Lenguaje**: Python
- **Base de Datos**: SQLite
- **Autenticación**: JWT

## Estructura del Proyecto

```
sports-match/
├── app/                    # Páginas de la aplicación
├── components/            # Componentes reutilizables
├── context/              # Contextos de React
├── data/                 # Datos mock
├── public/              # Archivos estáticos
├── styles/              # Estilos globales
└── untitled/            # Backend FastAPI
```

## Requisitos Previos

- Node.js v20.19.2 o superior
- npm v11.4.1 o superior
- Python 3.9+ (para el backend)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/sports-match.git
cd sports-match
```

2. Instalar dependencias del frontend:
```bash
npm install
```

3. Instalar dependencias del backend:
```bash
cd untitled
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Iniciar el backend:
```bash
cd untitled
uvicorn app.main:app --reload
```

5. Iniciar el frontend (en otra terminal):
```bash
npm run dev
```

6. Abrir el navegador en `http://localhost:3000`

## API Endpoints

### Autenticación
- `POST /auth/register`: Registro de usuarios
- `POST /auth/login`: Inicio de sesión
- `GET /users/me`: Obtener información del usuario actual

### Perfiles
- `GET /profiles`: Obtener todos los perfiles
- `GET /profiles/{id}`: Obtener un perfil por ID
- `POST /profiles`: Crear un nuevo perfil
- `PUT /profiles/{id}`: Actualizar un perfil
- `DELETE /profiles/{id}`: Eliminar un perfil

### Matches
- `GET /matches?user_id={user_id}`: Obtener matches de un usuario
- `GET /matches/{id}`: Obtener un match por ID
- `POST /matches`: Crear un nuevo match

### Mensajes
- `GET /messages?match_id={match_id}`: Obtener mensajes de un match
- `POST /messages`: Crear un nuevo mensaje
- `PATCH /messages/read?match_id={match_id}&user_id={user_id}`: Marcar mensajes como leídos

## Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@ejemplo.com

Link del Proyecto: [https://github.com/tu-usuario/sports-match](https://github.com/tu-usuario/sports-match)
