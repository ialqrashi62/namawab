# Developer Onboarding
v1.0 — Target: shipping a PR by day 5

## Day 1 — Environment
- [ ] GitHub access + 2FA
- [ ] Clone monorepo, run `make up` (docker-compose dev stack)
- [ ] `make seed && make migrate` against local MSSQL
- [ ] Run `make test` — all green
- [ ] Open Portal at `http://localhost:8080`; AI orchestrator at `:8000/docs`
- [ ] Read `docs/00_Master_Blueprint.md` and `docs/CONTRIBUTING.md`

## Day 2 — Architecture
- [ ] Read `docs/architecture/C4_overview.md`
- [ ] Read `docs/security/security_baseline.md`
- [ ] Read `docs/ai-governance/policy.md`
- [ ] Walk through `docs/backend-skeleton/` and `docs/frontend-skeleton/`
- [ ] Pair with a senior on a real PR (review-only)

## Day 3 — Domain
- [ ] Read 1 primary group file (e.g., G24 ED) end-to-end
- [ ] Read corresponding OpenAPI YAML
- [ ] Trace one event through DB → Kafka → consumer
- [ ] Write a failing test for a known small bug

## Day 4 — First PR
- [ ] Pick a "good-first-issue" from the backlog
- [ ] Branch `feat/...` or `fix/...`
- [ ] Code + tests + docs
- [ ] Open PR; address review comments

## Day 5 — Merge + reflect
- [ ] PR merged
- [ ] Update onboarding notes with anything you wish you'd known

## Reading list (week 2)
- Order sets + CDS rules (`docs/clinical/`)
- LangGraph base (`docs/orchestration/langgraph_base.py`)
- KSA integration handbook for the part you'll work on
- Runbooks (DR, IR, on-call)

## Skills checkpoint (week 4)
- Comfortable with: FastAPI, async SQLAlchemy, React 19 + TanStack Query
- Familiar with: LangGraph, Qdrant, Kafka, OIDC/JWT, Tailwind
- Aware of: PDPL constraints, CBAHI standards, AI governance gates

## Local quality gates (before push)
- `make lint && make test`
- `pre-commit run --all-files`
- `gitleaks detect`

## Where to ask
- Slack #nama-developers (general)
- Slack #nama-on-call (production-like questions)
- Code owners listed in `CODEOWNERS`
- Architecture decisions: ADRs in `docs/adr/`
