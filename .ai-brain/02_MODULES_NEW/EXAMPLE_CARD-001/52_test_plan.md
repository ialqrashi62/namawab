# 52 — Test Plan (CARD-001)

> Owner: ORC · Tier 1

## Test pyramid

```
        /\
       /  \         E2E (Playwright) — 38 tests
      / E2E\
     /______\
    /        \
   /  Integ.  \    Integration (Node + supertest) — 70 tests
  /____________\
 /              \
/    Unit (node)  \  Unit (node:test) — 83 tests
/__________________\
```

## Test levels

| Level | Tool | Target | Files | Count |
|-------|------|--------|-------|-------|
| Unit | node:test | Engines, helpers, parsers | cardiology_engine_test.js, etc. | 83 |
| Integration | node:test + supertest | Routes, auth, RLS, IDM, NPHIES, co-pilot | *_integration_test.js, cross_tenant_cardiology_test.js | 70 |
| E2E | Playwright | User journeys, red flag, NPHIES, co-pilot | e2e/cardiology/*.spec.js | 38 |
| Security | OWASP ZAP + manual | Pen test, LLM injection, RLS, RBAC | pen_test_*.sh | 30+ |
| Performance | k6 / autocannon | Latency, throughput | perf_*.js | 10 |
| LLM eval | RAGAS + DeepEval | Faithfulness, citation, refusal, red-flag detection | llm_eval_*.py | 100+ prompts |

## Total test count: 300+ tests

## Test environment

- **Local:** `nama_medical_test` DB (isolated), `localhost:3000`
- **Staging:** `staging.jumanasoft.com` (HTTPS, HTTP-only fallback)
- **Production smoke:** `jumanasoft.com` (limited read-only checks)

## Test data

- Synthetic only (no real PHI)
- Seed: `namaweb/dev_seed.sql` (dummy data)
- Fixtures: `namaweb/fixtures/*.json` (synthetic ECG, echo, cath)
- Per test: clean DB state via transaction rollback OR truncate

## Pre-commit

- [ ] Lint passes
- [ ] Unit tests pass
- [ ] Coverage > 80% (engines), 100% critical paths
- [ ] No new hardcoded secrets
- [ ] No new RLS regression

## Pre-merge to integration/all-epics

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Cross-tenant tests pass
- [ ] LLM eval pass (faithfulness > 0.85, citation > 0.95)
- [ ] Coverage > 80%
- [ ] Security scan (npm audit + Snyk + CodeQL)

## Pre-deploy to staging

- [ ] All unit + integration + E2E pass
- [ ] Pen test smoke (OWASP ZAP baseline)
- [ ] LLM cost projection within cap
- [ ] Migrations forward + backward tested
- [ ] Smoke test on staging

## Pre-deploy to production

- [ ] All pre-deploy staging + smoke staging 24h
- [ ] Owner approval
- [ ] Backup verified
- [ ] Rollback plan ready
- [ ] On-call rotation ready

## Continuous

- [ ] Daily: full test suite in CI
- [ ] Weekly: LLM eval + drift detection
- [ ] Monthly: pen test smoke
- [ ] Quarterly: full pen test
- [ ] Quarterly: DR drill
- [ ] Annually: full JCI mock + compliance audit

## Coverage targets

| File | Target |
|------|--------|
| `cardiology_engine.js` | 90% |
| `cardiology_copilot_helpers.js` | 85% |
| `cardiology_nphies_helpers.js` | 90% |
| `cardiology_red_flag_handlers.js` | 95% |
| Route handlers (cardiology/*) | 80% |
| Overall | 80% |

## Test discipline

- One test = one assertion (or one logical group)
- No shared mutable state between tests
- Cleanup: rollback OR truncate
- No test depends on another test's order
- No test uses real PHI
- No test uses real production DB
- No test makes real LLM call (mock) unless E2E on staging

## Mocking

- LLM: mock for unit/integration (use deterministic responses)
- LLM: real for E2E on staging (with PHI redaction)
- NPHIES: mock for unit/integration
- NPHIES: real sandbox for E2E on staging
- Email/SMS: mock
- OpenAI: real API key in test env (low cost cap)
