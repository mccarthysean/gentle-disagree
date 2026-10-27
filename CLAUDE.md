# Gentle Disagree - Claude Code Instructions

## Project Overview

Gentle Disagree (gentledisagree.space) is a privacy-focused couples therapy Progressive Web App that guides couples through constructive conflict resolution using the "Soft Startups" communication technique.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 7 + TanStack Router + Tailwind CSS v4
- **Storage**: localStorage (device only - no server storage)
- **PWA**: vite-plugin-pwa with Workbox

## Privacy First

This app stores NO user data on servers:
- All conversation data stays in localStorage
- No backend server needed
- No accounts, no login required

## Key Concepts

### Soft Startups (5 Steps)
1. **Readiness Check** - Is this a calm moment?
2. **Gentle Approach** - Teamwork mindset, calm tone
3. **I-Statement** - "I feel [emotion] when [situation]"
4. **Problem Description** - One specific issue
5. **Respectful Request** - "Could you please..."

### Gottman Repair Phrases (6 Categories)
1. "I Feel" - Expressing emotions
2. "I Need to Calm Down" - Needing support
3. "I'm Sorry" - Apologizing
4. "Stop Action" - Taking a break
5. "Getting to Yes" - Validation/compromise
6. "I Appreciate" - Adding positivity

## Development Commands

```bash
# Frontend
cd frontend && bun install
bun run dev          # Start dev server
bun run build        # Build for production
bun run lint         # Run ESLint
bun run typecheck    # TypeScript check

# Docker
docker compose up    # Start frontend service
```

## Design System

### Colors (Calming Theme)
- Sage Green: `#5B8C6A` (primary)
- Cream: `#FDF9F3` (background)
- Sand: `#F5F0E8` (cards)
- Mint: `#E8F5EB` (affirmations)
- Text: `#2C3E2D` (primary text)

### Typography
- Display: Playfair Display
- Body: Nunito

## File Structure

```
gentle-disagree/
├── frontend/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom hooks (useLocalSession)
│   │   ├── lib/           # Utilities (storage)
│   │   └── routes/        # TanStack Router pages
│   └── vite.config.ts
└── docker-compose.yml
```

## Deployment

- Frontend only: Cloudflare Pages project `gentle-disagree`.
- `.github/workflows/ci.yml` validates pull requests and deploys `frontend/dist`
  on pushes to main or manual dispatches on main.
- Required GitHub secrets: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`.
- Preserve the public HTTPS origin so existing localStorage sessions remain accessible.
- `docker-compose.production.yml` is historical Swarm configuration, not the release path.
- Load `.claude/skills/github-actions-deployment/SKILL.md` for workflow, preview and release checks; Codex uses the matching `.agents/skills` symlink. There is no path filter, so a docs-only main merge also deploys Pages.
- No Railway service/server database or database MCP route belongs to this app. The [central hosting guide](https://github.com/mccarthysean/personal-websites-hosting/blob/main/railway/README.md) covers shared Pages/domain operations; its backend/DB procedures apply to other sites. Preserve existing localStorage and the canonical origin; never clear real conversations during QA.
- 2026-10-26 source check: current `ci.yml` uploads static assets directly to Pages; `frontend/src/lib/storage.ts` remains device-only. No backend or database was added.

## Important Notes

- Use `bun` for frontend package management (not npm)
- All routes use TanStack Router file-based routing
- localStorage key: `gentle-disagree-sessions`


## Tool Usage — Native Tools First

Prefer native Claude Code tools over Bash — they need no permission prompts:
- **Read files**: `Read` tool, not `cat`/`head`/`tail`
- **Write files**: `Write` tool, not heredocs or `echo >`
- **Edit files**: `Edit` tool, not `sed`/`awk`
- **Find files**: `Glob` tool, not `find`/`ls`
- **Search content**: `Grep` tool, not `grep`/`rg`
- **JSON data**: `Read` + `Edit` tools, not `jq`

Reserve `Bash` for commands that genuinely need the shell: `git`, `uv`, `bun`, `curl`, `docker`, `nc`, etc.
