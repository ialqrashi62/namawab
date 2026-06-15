# Contributing to NamaMedical
Thanks for contributing! This document outlines how we work together.

## Code of Conduct
By participating you agree to follow `CODE_OF_CONDUCT.md`.

## How to contribute
1. Pick or open an issue in the appropriate project board.
2. Fork or branch off `main` with naming `feat/<dept>/<short-desc>` or `fix/<dept>/<short-desc>`.
3. Write code + tests + docs together.
4. Open a PR with the template; request review.

## Branching & commits
- `main` is protected; PRs only.
- Conventional Commits style: `feat(cardio): add HEART score calculator`.
- Sign your commits when feasible (`git commit -S`).

## PR checklist
- [ ] Linked to issue / user story.
- [ ] Tests pass locally (`make test`).
- [ ] Lint clean (`make lint`).
- [ ] Docs updated (per-dept md + i18n if user-facing).
- [ ] OpenAPI updated if API changed.
- [ ] Migration provided if schema changed (forward-only).
- [ ] Audit/PHI considerations noted in PR description.
- [ ] No secrets committed; `.env.example` updated if new var.
- [ ] CHANGELOG entry added under `Unreleased`.

## Coding standards
- Python: ruff + mypy strict; pyproject in `dev-tooling/`.
- TS/JS: ESLint + Prettier; strict TS.
- C++: clang-tidy + clang-format.
- SQL: SQL Server T-SQL; UUID PKs; DATETIMEOFFSET; index hot paths.

## Tests
- Unit tests next to code (`*_test.py`, `*.test.ts`).
- Integration tests in `tests/integration/`.
- E2E in `e2e/`.
- Golden snapshots for AI outputs.

## Documentation
- For any new feature affecting clinicians: update relevant `groups/{NN}_*.md`.
- For any API change: update OpenAPI + Postman.
- For new screens: update Figma + i18n + manuals.

## Security
- Report vulnerabilities privately per `SECURITY.md`.
- Never commit PHI, real patient data, or credentials.
- Run `gitleaks` before pushing.

## Release process
- Semver; tag `vX.Y.Z`.
- Tagging triggers production deploy (with approval).
- Update `CHANGELOG.md`.

## Reviewers' guide
- Confirm PHI/PDPL implications considered.
- Verify migration is reversible-by-snapshot only and no destructive ops in prod path.
- Confirm test coverage on safety-critical paths (P0).
- AI changes: model card or risk-assessment update if behavior changed.
