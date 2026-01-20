---
name: development-servers
description: Manage Vite development server for Gentle Disagree. Use when starting the application, after code changes, when servers crash, verifying servers are running, or troubleshooting errors. (project)
allowed-tools: [Bash, Read]
---

# Development Servers Skill

Manage the Vite (frontend) development server for Gentle Disagree.

## Server Stack

| Service | Port | Description |
|---------|------|-------------|
| Vite | 5200 | React frontend with HMR |

## Quick Start

### Start with Docker

```bash
cd /home/sean/git_wsl/gentle-disagree
docker compose up -d
```

### Start Manually (Development)

```bash
cd /home/sean/git_wsl/gentle-disagree/frontend
bun install  # First time only
bun run dev  # Starts on port 5200
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
- Frontend: `http://localhost:5200`

### Docker Compose
- Frontend: `http://localhost:3000`

## Quick Verification

```bash
# Check Vite (dev mode)
curl -f http://localhost:5200 && echo "Vite OK"

# Check Docker frontend
curl -f http://localhost:3000 && echo "Frontend OK"
```

## Auto-Reload

Vite has built-in hot module replacement - changes are reflected immediately.

Manual restart only needed for:
- Package installations
- Configuration file changes (vite.config.ts, tailwind.config.js)

## Reference Files

For detailed troubleshooting and configuration:
- `troubleshooting.md` - Common problems and solutions
