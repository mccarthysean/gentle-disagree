---
name: development-servers
description: Manage Vite, FastAPI, and Ollama development servers for Gentle Disagree. Use when starting the application, after code changes, when servers crash, verifying servers are running, or troubleshooting errors. (project)
allowed-tools: [Bash, Read]
---

# Development Servers Skill

Manage Vite (frontend), FastAPI (backend), and Ollama (AI) development servers for Gentle Disagree.

## Server Stack

| Service | Port | Description |
|---------|------|-------------|
| Vite | 5200 | React frontend with HMR |
| FastAPI | 8000-8002 | REST API backend (stateless) |
| Ollama | 11434 | Local AI (Llama 3.2) |

## Quick Start

### Start All Services (Docker)

```bash
cd /home/sean/git_wsl/gentle-disagree
docker compose up -d
```

### Start Services Manually (Development)

```bash
# Terminal 1: Frontend
cd /home/sean/git_wsl/gentle-disagree/frontend
bun install  # First time only
bun run dev  # Starts on port 5200

# Terminal 2: Backend (Option A - fastapi dev)
cd /home/sean/git_wsl/gentle-disagree/backend
uv sync  # First time only
uv run fastapi dev app/main.py --port 8000

# Terminal 2: Backend (Option B - uvicorn, use if port conflicts)
cd /home/sean/git_wsl/gentle-disagree/backend
uv run uvicorn app.main:app --port 8002 --host 0.0.0.0 --reload

# Terminal 3: Ollama (if not using Docker)
ollama serve
ollama pull llama3.2:3b
```

### Port Conflict Resolution

If you see "Address already in use" errors:

```bash
# Find and kill process on a specific port
lsof -ti :8000 | xargs -r kill -9

# Or use uvicorn with an alternative port
uv run uvicorn app.main:app --port 8002 --host 0.0.0.0 --reload

# Update frontend/.env to match:
# VITE_API_URL=http://localhost:8002
```

## Core Commands

### Frontend (Vite)

```bash
cd /home/sean/git_wsl/gentle-disagree/frontend

# Install dependencies
bun install

# Start dev server (port 5200)
bun run dev

# Build for production
bun run build

# Lint code
bun run lint

# Type check
bun run typecheck
```

### Backend (FastAPI)

```bash
cd /home/sean/git_wsl/gentle-disagree/backend

# Install dependencies
uv sync

# Start dev server with fastapi CLI (port 8000)
uv run fastapi dev app/main.py

# OR start with uvicorn directly (more control)
uv run uvicorn app.main:app --port 8002 --host 0.0.0.0 --reload

# Lint code
uv run ruff check .

# Format code
uv run ruff format .
```

### Docker Compose

```bash
cd /home/sean/git_wsl/gentle-disagree

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild after changes
docker compose up -d --build
```

## Environment Variables

### Frontend (frontend/.env)
```env
# API URL - update port if backend uses different port
VITE_API_URL=http://localhost:8002
```

### Backend (implicit defaults in main.py)
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
CORS_ORIGINS=*
```

## URLs

### Development (Manual Start)
- Frontend: `http://localhost:5200`
- API Docs: `http://localhost:8002/docs`
- API Health: `http://localhost:8002/health`
- Ollama: `http://localhost:11434`

### Docker Compose
- Frontend: `http://localhost:3000`
- API Docs: `http://localhost:8000/docs`
- Ollama: `http://localhost:11434`

## Quick Verification

```bash
# Check FastAPI (adjust port as needed)
curl -f http://localhost:8002/health && echo "FastAPI OK"

# Check Vite (dev mode)
curl -f http://localhost:5200 && echo "Vite OK"

# Check Ollama
curl -f http://localhost:11434/api/tags && echo "Ollama OK"

# Test AI endpoint
curl -X POST http://localhost:8002/ai/reframe \
  -H "Content-Type: application/json" \
  -d '{"statement": "You never listen to me"}' | jq .
```

## Auto-Reload

Both services have auto-reload enabled:
- **Vite**: Built-in hot module replacement
- **FastAPI/uvicorn**: `--reload` flag monitors code changes

Manual restart only needed for:
- Environment variable changes
- Package installations
- Configuration file changes

## Reference Files

For detailed troubleshooting and configuration:
- `troubleshooting.md` - Common problems and solutions
- `architecture.md` - Server architecture details
