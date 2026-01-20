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

## Important Notes

- Use `bun` for frontend package management (not npm)
- All routes use TanStack Router file-based routing
- localStorage key: `gentle-disagree-sessions`
