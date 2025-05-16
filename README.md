# SportMatch - Sports Partner Finder

A web application to find sports partners in your area.

## Project Structure

- `backend/`: Python Flask backend with MongoDB Atlas integration
- `app/`: Next.js frontend application

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.9+
- MongoDB Atlas account

### Backend Setup

1. Create a MongoDB Atlas account and get your connection string
2. Navigate to the backend directory:
   \`\`\`
   cd backend
   \`\`\`
3. Create a virtual environment:
   \`\`\`
   python -m venv venv
   \`\`\`
4. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
5. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`
6. Create a `.env` file with your MongoDB Atlas connection string:
   \`\`\`
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/sportmatch?retryWrites=true&w=majority
   MONGODB_DB_NAME=sportmatch
   PORT=5000
   \`\`\`
7. Seed the database:
   \`\`\`
   python seed_db.py
   \`\`\`
8. Start the backend server:
   \`\`\`
   python run.py
   \`\`\`

### Frontend Setup

1. In the root directory, install dependencies:
   \`\`\`
   npm install
   \`\`\`
2. Create a `.env.local` file:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:5000
   \`\`\`
3. Start the frontend development server:
   \`\`\`
   npm run dev
   \`\`\`
4. Open your browser and navigate to `http://localhost:3000`

### Docker Setup (Optional)

You can also use Docker Compose to run both the frontend and backend:

\`\`\`
docker-compose up
\`\`\`

## API Endpoints

### Profiles

- `GET /api/profiles`: Get all profiles
- `GET /api/profiles/:id`: Get a profile by ID
- `POST /api/profiles`: Create a new profile
- `PUT /api/profiles/:id`: Update a profile
- `DELETE /api/profiles/:id`: Delete a profile

### Matches

- `GET /api/matches?userId=:userId`: Get matches for a user
- `GET /api/matches/:id`: Get a match by ID
- `POST /api/matches`: Create a new match

### Messages

- `GET /api/messages?matchId=:matchId`: Get messages for a match
- `POST /api/messages`: Create a new message
- `PATCH /api/messages/read?matchId=:matchId&userId=:userId`: Mark messages as read

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Python, Flask, PyMongo
- **Database**: MongoDB Atlas
- **Deployment**: Docker, Docker Compose
