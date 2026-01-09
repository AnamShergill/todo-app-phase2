# TodoBoom - Explode your productivity. One task at a time.

A hackathon-ready todo application that explodes your productivity with authentication and AI-powered chatbot functionality.

## Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLModel
- **Database**: PostgreSQL (Neon-compatible)
- **Authentication**: JWT-based with Better Auth concepts
- **Chatbot**: Natural language processing for task management

## Prerequisites

- Node.js 18+
- Python 3.9+
- PostgreSQL (or Neon account)

## Running the Application

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and secret keys
   ```

5. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the project root:
   ```bash
   cd ..
   ```

2. Install Node.js dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env.local file in the frontend directory
   echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local
   ```

4. Run the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

## Project Structure

```
backend/
├── main.py                 # Main FastAPI application
├── src/
│   ├── api/               # API routes (auth, tasks, chatbot)
│   ├── database/          # Database configuration
│   ├── models/            # SQLModel database models
│   ├── schemas/           # Pydantic request/response schemas
│   └── services/          # Business logic services
└── requirements.txt

frontend/
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   └── lib/              # Utility functions and API client
├── package.json
└── next.config.js
```

## API Documentation

After starting the backend, API documentation is available at:
- `http://localhost:8000/docs` - Interactive API documentation (Swagger UI)
- `http://localhost:8000/redoc` - Alternative API documentation (ReDoc)

## Features

- **Authentication**: Secure JWT-based user authentication
- **Task Management**: Full CRUD operations for boom tasks
- **AI Assistant**: Natural language interface for exploding productivity
- **Responsive UI**: Works on desktop, tablet, and mobile devices
- **User Isolation**: Each user sees only their own tasks

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time

### Frontend (.env.local)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL (default: http://localhost:8000)