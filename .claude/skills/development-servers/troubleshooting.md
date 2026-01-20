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

## Problem: Dependencies Not Installed

```bash
cd /home/sean/git_wsl/gentle-disagree/frontend
bun install
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

## Best Practices

1. **Check status first** - Don't assume servers are running
2. **Use curl for health checks** - Much faster than opening browser
3. **Check logs before restarting** - Understand the problem first
4. **Clean restart when in doubt** - Stop all, then start fresh
5. **Use Docker for full stack** - Simpler than running manually
