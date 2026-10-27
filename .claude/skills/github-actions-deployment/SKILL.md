---
name: github-actions-deployment
description: "Inspect Gentle Disagree GitHub Actions, Cloudflare Pages deploys, previews or rollback; preserve browser-local conversations and distinguish this static site from Railway APIs."
---

# Gentle Disagree Pages releases

Read [the workflow contract](references/workflow-contract.md) and current `.github/workflows/ci.yml` before acting. This app is a static React/PWA frontend on Pages project `gentle-disagree`; it has no backend, Railway service, server database, authentication service or database MCP route.

1. Bind the repository, selected commit/ref and requested preview/production target. PRs validate; main pushes and manual main dispatches deploy after validation. This includes a documentation-only merge because the workflow has no path filter.
2. Use the workflow's existing `gentle-disagree-frontend` artifact and existing scoped Pages credentials. Never print tokens or create credentials/services as a deployment convenience.
3. Preserve `gentledisagree.space` and its HTTPS origin. Conversations use browser `localStorage`; preview, www and canonical origins have separate storage. Do not clear storage or use personal conversation content for QA.
4. Verify the actual Pages deployment/source, public route rendering and basic offline/PWA behavior for the selected artifact. A green build alone is not deployment acceptance. Report the exact checks run; a preview does not establish production success.

The [central personal hosting guide](https://github.com/mccarthysean/personal-websites-hosting/blob/main/railway/README.md) owns the wider Pages/domain boundaries. Railway/PostgreSQL/backup-worker instructions there concern other personal apps, not this site's local conversation storage. A frontend rollback changes assets; it neither restores nor migrates a server database.

`docker-compose.production.yml` is historical Swarm configuration, not the current release path. Keep company/RCOM services and shared MCP configuration outside this task.

2026-10-26 evidence: current CI workflow, frontend package and `src/lib/storage.ts` were read. No workflow, app code or provider setting changed with this skill.
