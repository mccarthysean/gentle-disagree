# Development Servers Architecture

## Three-Tier Stack

```
┌─────────────────────────────────────────┐
│  Vite (Port 5200 / 3000)                │
│  React 19 + TypeScript Frontend         │
│  TanStack Router + Tailwind CSS v4      │
│  Hot Module Replacement                 │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  FastAPI (Port 8000)                    │
│  Stateless REST API                     │
│  AI reframing endpoints                 │
│  No database - ephemeral processing     │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Ollama (Port 11434)                    │
│  Local LLM inference                    │
│  Llama 3.2 or Mistral                   │
└─────────────────────────────────────────┘
```

## Project Structure

```
gentle-disagree/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── hooks/            # Custom hooks (useLocalSession)
│   │   ├── lib/              # Utilities (storage, ai)
│   │   └── routes/           # TanStack Router pages
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # FastAPI backend
│   ├── app/
│   │   └── main.py           # API endpoints
│   └── pyproject.toml
├── docker-compose.yml        # Local development
└── docker-compose.production.yml
```

## Configuration Files

### Frontend
- Package config: `frontend/package.json`
- Vite config: `frontend/vite.config.ts`
- TypeScript: `frontend/tsconfig.json`
- Tailwind: `frontend/src/index.css`

### Backend
- Project config: `backend/pyproject.toml`
- Main app: `backend/app/main.py`

### Environment Variables

**Backend (backend/.env or docker-compose.yml):**
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Frontend (frontend/.env):**
```env
VITE_API_URL=http://localhost:8000
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check with Ollama status |
| `/ai/reframe` | POST | Reframe statement to I-statement |
| `/ai/suggest-emotions` | POST | Suggest emotion words |

## Data Flow

1. **User enters statement** in React frontend
2. **Frontend calls** `/ai/reframe` endpoint
3. **FastAPI forwards** request to Ollama
4. **Ollama processes** with Llama 3.2 model
5. **Response returned** through FastAPI to frontend
6. **Data stored locally** in browser localStorage (privacy-first)

## Privacy Architecture

- **No database** - All session data in localStorage
- **Ephemeral AI** - Requests processed and discarded
- **No accounts** - No user registration required
- **Local-first** - Works offline after initial load (PWA)

## Docker Compose Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `frontend` | Custom | 3000 | Production Vite build |
| `api` | Custom | 8000 | FastAPI server |
| `ollama` | ollama/ollama | 11434 | AI inference |

## URLs Summary

| Environment | Frontend | API | Ollama |
|-------------|----------|-----|--------|
| Dev (manual) | :5200 | :8002 | :11434 |
| Docker | :3000 | :8000 | :11434 |
| Production | gentledisagree.space | /api | Internal |
