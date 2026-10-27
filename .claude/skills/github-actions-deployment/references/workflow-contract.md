# Gentle Disagree workflow contract

Source of truth: [ci.yml](../../../../.github/workflows/ci.yml).

| Event | Result |
|---|---|
| Pull request to main | Lint, TypeScript check, production build and upload `gentle-disagree-frontend`; no Pages deploy job |
| Push to main | Same validation, then deploy the saved assets to Pages `gentle-disagree` with `--branch=main` |
| Manual dispatch on main | Same validation and Pages production deployment |
| Manual dispatch on another ref | Validation runs; the main-only deploy condition does not pass |

There is no path filter: a docs-only main merge also releases the frontend. Do not call this pipeline manual-only or edit triggers merely to avoid a documentation deployment. Check `Deploy to Cloudflare Pages`, not only `Lint & Build`, for actual deployment outcome.

The workflow uses existing repository secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`; keep values out of commands/logs and preserve their scope. Assets are built once and downloaded by the deploy job. Current Dockerfiles/production Compose are historical/local alternatives; this workflow does not publish a container image or start a backend.

[storage.ts](../../../../frontend/src/lib/storage.ts) stores conversations under `gentle-disagree-sessions` in localStorage. There is no server-side copy to query via PostgreSQL/MCP, and a Railway database cannot recover a user's device storage. Preserve the canonical origin and existing data format. Use synthetic sessions for any separately requested QA, without clearing real data.

For a release or rollback, bind the exact reviewed source/artifact, Pages project/account and intended branch before acting. Keep DNS/mail records and unrelated personal/company projects unchanged. A preview has a separate origin and is not a migration of canonical conversations.
