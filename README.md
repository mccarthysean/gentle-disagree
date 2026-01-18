# Gentle Disagree

A privacy-focused couples therapy Progressive Web App that guides couples through constructive conflict resolution using the "Soft Startups" communication technique.

**Live at: [gentledisagree.space](https://gentledisagree.space)**

## Features

- **5-Step Guided Wizard**: Walk through the Soft Startup technique step by step
- **Privacy First**: All conversation data stays on your device only
- **No Accounts Required**: Start immediately without signing up
- **AI-Powered Reframing** (optional): Get help transforming blaming statements into constructive "I feel..." statements
- **Helpful Phrase Library**: Gottman repair phrases and templates at your fingertips
- **PWA**: Install on iOS and Android for easy access

## The Soft Startups Technique

Based on research by Drs. John and Julie Gottman who studied 30,000+ couples:

1. **Readiness Check** - Is this a calm moment?
2. **Gentle Approach** - Teamwork mindset, calm tone
3. **I-Statement** - "I feel [emotion] when [situation]"
4. **Problem Description** - One specific issue
5. **Respectful Request** - "Could you please..."

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + TanStack Router + Tailwind CSS v4
- **Backend**: FastAPI (stateless, AI only)
- **AI**: Ollama with Llama 3.2 or Mistral
- **Storage**: localStorage (device only)

## Development

### Prerequisites

- [Bun](https://bun.sh/) for frontend
- [uv](https://docs.astral.sh/uv/) for Python backend
- [Docker](https://www.docker.com/) for containerization

### Quick Start

```bash
# Clone the repository
git clone https://github.com/mccarthysean/gentle-disagree.git
cd gentle-disagree

# Frontend
cd frontend
bun install
bun run dev

# Backend (in another terminal)
cd backend
uv sync
uv run fastapi dev app/main.py

# Or use Docker
docker compose up
```

### Commands

```bash
# Frontend
bun run dev          # Start dev server
bun run build        # Build for production
bun run lint         # Run ESLint
bun run typecheck    # TypeScript check

# Backend
uv run fastapi dev app/main.py  # Start dev server
uv run ruff check .  # Lint
uv run ruff format . # Format
```

## Privacy

This app is designed with privacy as the top priority:

1. **No accounts required** - use immediately without signing up
2. **No server storage** - all conversation data stays on your device
3. **AI is optional** - wizard works fully without AI assistance
4. **AI is ephemeral** - reframing requests are processed and immediately discarded
5. **Open source** - anyone can verify the code

## License

MIT
