# Test Observability — Rad-001 (RAD-001)
**Last updated:** 2026-08-10

## Tests for Rad-001

### Pyramid

| Layer | Count | Tool | When |
|---|---|---|---|
| Unit | 50+ | Jest (JS) / pytest (Py) | Per commit |
| Integration | 20+ | supertest / httpx | Per PR |
| BDD | 10+ | Cucumber / Gherkin | Per feature |
| E2E | 5+ | Playwright | Nightly |
| Guard (boundary) | 5+ | custom | Per commit |

### Test coverage targets

- Overall: > 80%
- Rad-001 engine: > 90%
- Rad-001 critical paths: 100% (admit, discharge, sign, lock)

### Test naming convention

```
rad_001.<area>.<action>.<expectation>

e.g.
rad_001.create.valid_returns_201
rad_001.create.invalid_returns_400
rad_001.create.cross_tenant_returns_403
rad_001.update.locked_returns_409
```

### Coverage report

- Jest: `npm run test:coverage` → lcov + html
- pytest: `pytest --cov=nama --cov-report=html`
- BDD: `cucumber-js --format=html`
- E2E: Playwright `--reporter=html`

### CI gate

- Unit + Integration + Guard: must pass to merge
- BDD: must pass to deploy to staging
- E2E: must pass to deploy to prod

### Test data

- Factory pattern (faker.js / factory_boy)
- Per-tenant fixtures (cross-tenant test runner)
- Snapshot tests for OpenAPI specs (golden files)

### Mocking strategy

| Service | Mock? | Tool |
|---|---|---|
| LLM | Yes | nock / responses |
| Vector DB | Yes | pgvector test container |
| NPHIES | Yes | sandbox loopback |
| ZATCA | Yes | sandbox loopback |
| Email | Yes | smtp-mock |
| SMS | Yes | twilio test creds |

### Flake prevention

- No `setTimeout` in tests
- No `Date.now()` — use `Date.now = jest.fn()`
- All network calls intercepted
- All DB queries use transactional fixtures (rollback after test)
