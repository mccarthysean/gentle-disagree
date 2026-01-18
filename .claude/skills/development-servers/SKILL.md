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
| Vite | 5173 | React frontend with HMR |
| FastAPI | 8000 | REST API backend (stateless) |
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
bun run dev

# Terminal 2: Backend
cd /home/sean/git_wsl/gentle-disagree/backend
uv sync  # First time only
uv run fastapi dev app/main.py

# Terminal 3: Ollama (if not using Docker)
ollama serve
ollama pull llama3.2:3b
```

## Core Commands

### Frontend (Vite)

```bash
cd /home/sean/git_wsl/gentle-disagree/frontend

# Install dependencies
bun install

# Start dev server (port 5173)
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

# Start dev server (port 8000)
uv run fastapi dev app/main.py

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

## URLs

### Development (Manual Start)
- Frontend: `http://localhost:5173`
- API Docs: `http://localhost:8000/docs`
- API Health: `http://localhost:8000/health`
- Ollama: `http://localhost:11434`

### Docker Compose
- Frontend: `http://localhost:3000`
- API Docs: `http://localhost:8000/docs`
- Ollama: `http://localhost:11434`

## Quick Verification

```bash
# Check FastAPI
curl -f http://localhost:8000/health && echo "FastAPI OK"

# Check Vite (dev mode)
curl -f http://localhost:5173 && echo "Vite OK"

# Check Ollama
curl -f http://localhost:11434/api/tags && echo "Ollama OK"
```

## Auto-Reload

Both services have auto-reload enabled:
- **Vite**: Built-in hot module replacement
- **FastAPI**: `fastapi dev` monitors code changes

Manual restart only needed for:
- Environment variable changes
- Package installations
- Configuration file changes

## Reference Files

For detailed troubleshooting and configuration:
- `troubleshooting.md` - Common problems and solutions
- `architecture.md` - Server architecture details
