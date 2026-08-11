"""
Add buckets 50 (test_observability) and 51 (devops_runbook) to all department blueprints.
"""
import re
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

AIBRAIN = Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\02_MODULES")

def detect_dept_info(folder_name):
    m = re.match(r"^(DEP-\d+|[\w\-]+?)_(.+)$", folder_name)
    if m:
        prefix = m.group(1)
        name = m.group(2).replace("_", " ").title()
        return prefix, name
    return folder_name, folder_name.replace("_", " ").title()

def dept_id_lowercase(dept_id):
    return dept_id.lower().replace("-", "_")

def add_bucket_50_test_obs(dept_id, name, dept_dir):
    content = f"""# Test Observability — {name} ({dept_id})
**Last updated:** 2026-08-10

## Tests for {name}

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
- {name} engine: > 90%
- {name} critical paths: 100% (admit, discharge, sign, lock)

### Test naming convention

```
{dept_id_lowercase(dept_id)}.<area>.<action>.<expectation>

e.g.
{dept_id_lowercase(dept_id)}.create.valid_returns_201
{dept_id_lowercase(dept_id)}.create.invalid_returns_400
{dept_id_lowercase(dept_id)}.create.cross_tenant_returns_403
{dept_id_lowercase(dept_id)}.update.locked_returns_409
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
"""
    (dept_dir / "50_test_observability.md").write_text(content, encoding="utf-8")

def add_bucket_51_devops(dept_id, name, dept_dir):
    content = f"""# DevOps Runbook — {name} ({dept_id})
**Last updated:** 2026-08-10

## Deployment

### Pipeline

```
GitHub Actions:
  1. Lint (eslint + prettier)
  2. Unit tests (jest)
  3. Integration tests (supertest)
  4. Guard tests (boundary)
  5. BDD tests (cucumber)
  6. Migration check (forward + backward)
  7. Docker build
  8. Push to ghcr.io
  9. Deploy to Hetzner staging
  10. Smoke tests
  11. Manual approval
  12. Deploy to production
  13. Notify (Slack + PagerDuty)
```

### Rollback plan

| Issue | Action |
|---|---|
| App broken | `pm2 restart nama-medical-erp --update-env` (no code change) |
| Code broken | `git revert` + redeploy |
| Migration broken | run *_down.sql + restart |
| DB broken | restore from backup (last good backup) |
| Region down | failover to secondary region |

### Backup

- Daily pg_dump → S3 (encrypted)
- Weekly full + daily incremental
- Retention: 7d daily, 4w weekly, 12m monthly
- Restore test: monthly

### Monitoring (per dept)

- Latency p95 < 200ms
- Error rate < 0.1%
- RPS matches expected (alert if 10x or 0.1x)
- DB query p95 < 100ms
- Cache hit rate > 80%

### Alerts

| Severity | Channel |
|---|---|
| P1 | PagerDuty + SMS + Slack |
| P2 | Slack + email |
| P3 | email |
| P4 | log only |

### {name}-specific runbook

- How to restart just the {name} engine: `pm2 restart nama-medical-erp --name={dept_id_lowercase(dept_id)}`
- How to scale {name}: edit `pm2.config.js` → `{dept_id_lowercase(dept_id)}: instances=4`
- How to clear {name} cache: `redis-cli -n 1 FLUSHDB`
- How to replay {name} audit log: `node scripts/replay_audit.js --dept={dept_id}`

### Secrets rotation

- DB password: every 90d
- API keys: every 180d
- JWT signing key: every 365d
- Crypto envelope KEK: every 730d (with re-encryption of all PHI)
"""
    (dept_dir / "51_devops_runbook.md").write_text(content, encoding="utf-8")

# Process all depts
dept_dirs = sorted([d for d in AIBRAIN.iterdir() if d.is_dir()])
total_added = 0
for dept_dir in dept_dirs:
    dept_id, name = detect_dept_info(dept_dir.name)
    add_bucket_50_test_obs(dept_id, name, dept_dir)
    add_bucket_51_devops(dept_id, name, dept_dir)
    total_added += 2
    print(f"  +2 {dept_dir.name}")

print(f"\nTotal files added: {total_added}")
