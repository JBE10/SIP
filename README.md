# SportMatch - Encuentra Compañeros Deportivos

Una aplicación web moderna para encontrar compañeros deportivos en tu área.

## Descripción

SportMatch es una plataforma que conecta a personas con intereses deportivos similares en Buenos Aires. La aplicación permite a los usuarios crear perfiles, especificar sus deportes preferidos y encontrar compañeros para practicar deportes.

## Características Principales

- 🔐 Autenticación de usuarios con JWT
- 👤 Perfiles personalizables con foto
- 📸 Subida de fotos de perfil
- 🎯 Sistema de swipe para matching
- 💬 Chat en tiempo real (simulado)
- 🌓 Modo oscuro/claro
- 📱 Diseño responsive

## Tecnologías Utilizadas

### Frontend
- **Framework**: Next.js 15.2.4
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: Radix UI + Shadcn UI
- **Animaciones**: Framer Motion
- **Estado**: React Context

### Backend
- **Framework**: FastAPI
- **Lenguaje**: Python 3.13
- **Base de Datos**: SQLite
- **Autenticación**: JWT
- **Subida de archivos**: FastAPI File Upload

## Estructura del Proyecto

```
sports-match/
├── app/                    # Páginas de la aplicación (Next.js)
├── components/            # Componentes reutilizables
├── context/              # Contextos de React
├── data/                 # Datos mock
├── public/              # Archivos estáticos
├── backend/             # Backend FastAPI
│   ├── app/            # Código de la aplicación
│   │   ├── main.py    # Archivo principal
│   │   ├── auth.py    # Autenticación
│   │   ├── models.py  # Modelos de base de datos
│   │   ├── schemas.py # Esquemas Pydantic
│   │   └── static/    # Archivos subidos
│   ├── sportmatch.db  # Base de datos SQLite
│   └── requirements.txt
└── package.json
```

## Requisitos Previos

- **Node.js** v20.19.2 o superior
- **npm** v11.4.1 o superior
- **Python** 3.9+ (recomendado 3.13)
- **Git** (para clonar el repositorio)

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/sports-match.git
cd sports-match
```

### 2. Configuración del Backend (FastAPI)

#### 2.1 Crear entorno virtual de Python
```bash
cd backend
python -m venv venv

# En macOS/Linux:
source venv/bin/activate

# En Windows:
venv\Scripts\activate
```

#### 2.2 Instalar dependencias
```bash
pip install fastapi uvicorn sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart
```

#### 2.3 Configurar la base de datos
```bash
# Asegurarse de que la base de datos tenga permisos correctos
chmod 666 sportmatch.db  # Solo en macOS/Linux
```

#### 2.4 Iniciar el servidor backend
```bash
# Desde la carpeta backend/
uvicorn app.main:app --reload --port 8000
```

El backend estará disponible en: `http://localhost:8000`
API Docs disponible en: `http://localhost:8000/docs`

### 3. Configuración del Frontend (Next.js)

#### 3.1 Instalar dependencias
```bash
# Desde la carpeta raíz del proyecto
npm install
```

#### 3.2 Iniciar el servidor de desarrollo
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

## URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **API Redoc**: http://localhost:8000/redoc

## Uso de la Aplicación

### 1. Registro de Usuario
1. Ve a http://localhost:3000
2. Haz clic en "Registrarse"
3. Completa el formulario con:
   - Email válido
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña

### 2. Configurar Perfil
1. Después del registro, serás redirigido al perfil
2. Haz clic en "Editar perfil"
3. Completa tu información:
   - Nombre de usuario
   - Biografía
   - Deportes preferidos
   - Foto de perfil (opcional)

### 3. Explorar y Hacer Match
1. Ve a la sección "Descubrir"
2. Swipe hacia la derecha para "Me gusta"
3. Swipe hacia la izquierda para "No me gusta"
4. Si hay match mutuo, aparecerá en "Matches"

## API Endpoints

### Autenticación
- `POST /auth/register`: Registro de usuarios
- `POST /auth/login`: Inicio de sesión
- `GET /users/me`: Obtener información del usuario actual

### Usuarios
- `PUT /users/me`: Actualizar información del usuario
- `POST /users/upload-photo`: Subir foto de perfil

### Perfiles
- `GET /profiles`: Obtener todos los perfiles
- `GET /profiles/{id}`: Obtener un perfil por ID

## Solución de Problemas

### Backend no inicia
- Verificar que Python esté instalado: `python --version`
- Verificar que el entorno virtual esté activado
- Verificar que todas las dependencias estén instaladas: `pip list`

### Frontend no inicia
- Verificar que Node.js esté instalado: `node --version`
- Limpiar caché de npm: `npm cache clean --force`
- Reinstalar dependencias: `rm -rf node_modules && npm install`

### Errores de base de datos
- Verificar permisos de la base de datos: `ls -la backend/sportmatch.db`
- Recrear la base de datos si es necesario

### Errores de CORS
- Verificar que el backend esté ejecutándose en el puerto 8000
- Verificar que el frontend esté ejecutándose en el puerto 3000

## Desarrollo

### Estructura de Comandos

```bash
# Iniciar backend
cd backend
source venv/bin/activate  # o venv\Scripts\activate en Windows
uvicorn app.main:app --reload --port 8000

# Iniciar frontend (en otra terminal)
npm run dev

# Ejecutar linter
npm run lint

# Construir para producción
npm run build
```

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
