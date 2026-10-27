# Gentle Disagree

A privacy-focused couples therapy Progressive Web App that guides couples through constructive conflict resolution using the "Soft Startups" communication technique.

**Live at: [gentledisagree.space](https://gentledisagree.space)**

## Features

- **5-Step Guided Wizard**: Walk through the Soft Startup technique step by step
- **Privacy First**: All conversation data stays on your device only
- **No Accounts Required**: Start immediately without signing up
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
- **Storage**: localStorage (device only)

## Development

### Prerequisites

- [Bun](https://bun.sh/) for frontend
- [Docker](https://www.docker.com/) for containerization (optional)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/mccarthysean/gentle-disagree.git
cd gentle-disagree

# Frontend
cd frontend
bun install
bun run dev

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
```

## Hosting

The frontend is deployed independently to Cloudflare Pages by
`.github/workflows/ci.yml`. Pull requests run lint, typecheck and a production
build. Pushes to `main` and manual dispatches on `main` upload the built
`frontend/dist` assets to the `gentle-disagree` Pages project.

The project must exist in the intended Cloudflare account, with repository
secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` (Pages Edit).
Configure `gentledisagree.space` and `www.gentledisagree.space` as custom
domains and update their DNS through the personal hosting configuration.

Pages provides the SPA fallback because the build has no top-level `404.html`.
Keep the public HTTPS origin stable: browser storage belongs to its origin,
so sessions on `gentledisagree.space` are not shared with preview URLs or www.
No API, database, container registry or RCOM release is required.

Read the [deployment skill](.claude/skills/github-actions-deployment/SKILL.md) for exact event/job/artifact checks and the [personal hosting guide](https://github.com/mccarthysean/personal-websites-hosting/blob/main/railway/README.md) for Pages/domain boundaries. There is no workflow path filter: documentation-only main merges also deploy Pages. No Railway backend or database access should be provisioned for this app. The current storage contract is `frontend/src/lib/storage.ts`; existing browser data must stay intact during releases and QA.

## Privacy

This app is designed with privacy as the top priority:

1. **No accounts required** - use immediately without signing up
2. **No server storage** - all conversation data stays on your device
3. **No backend needed** - the app runs entirely in your browser
4. **Open source** - anyone can verify the code

## License

MIT
