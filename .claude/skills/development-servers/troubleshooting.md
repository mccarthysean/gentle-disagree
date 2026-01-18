# Development Servers Troubleshooting

## Problem: Port Already in Use

**Symptoms:**
- "Address already in use" errors
- Server won't start

**Solution:**
```bash
# Find and kill process on port 5173 (Vite)
lsof -ti:5173 | xargs kill -9

# Find and kill process on port 8000 (FastAPI)
lsof -ti:8000 | xargs kill -9

# Then restart servers
```

## Problem: Frontend Can't Reach API

**Symptoms:**
- CORS errors in browser console
- Network errors in React app
- API calls failing

**Diagnosis:**
```bash
# Check both servers are running
curl -f http://localhost:8000/health
curl -f http://localhost:5173
```

**Solutions:**
1. Ensure both servers are running
2. Check CORS settings in `backend/app/main.py`
3. Verify `VITE_API_URL` in frontend environment

## Problem: Ollama Not Responding

**Symptoms:**
- AI reframing not working
- 502/504 errors from FastAPI

**Diagnosis:**
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Check if model is downloaded
ollama list
```

**Solution:**
```bash
# Start Ollama
ollama serve

# Pull the model
ollama pull llama3.2:3b

# Or use Docker
docker compose up -d ollama
```

## Problem: Dependencies Not Installed

### Frontend
```bash
cd /home/sean/git_wsl/gentle-disagree/frontend
bun install
```

### Backend
```bash
cd /home/sean/git_wsl/gentle-disagree/backend
uv sync
```

## Problem: TypeScript Errors

**Solution:**
```bash
cd /home/sean/git_wsl/gentle-disagree/frontend

# Check types
bun run typecheck

# Fix lint issues
bun run lint
```

## Problem: Python Lint Errors

**Solution:**
```bash
cd /home/sean/git_wsl/gentle-disagree/backend

# Check and fix
uv run ruff check --fix .
uv run ruff format .
```

## Problem: Docker Compose Issues

**Container won't start:**
```bash
# Check logs
docker compose logs

# Rebuild containers
docker compose up -d --build

# Full reset
docker compose down
docker compose up -d
```

**Ollama out of memory:**
- Increase Docker memory limit in Docker Desktop settings
- Use a smaller model: `OLLAMA_MODEL=llama3.2:1b`

## Best Practices

1. **Check status first** - Don't assume servers are running
2. **Use curl for health checks** - Much faster than opening browser
3. **Check logs before restarting** - Understand the problem first
4. **Clean restart when in doubt** - Stop all, then start fresh
5. **Use Docker for full stack** - Simpler than running manually
