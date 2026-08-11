---
name: nm-quality-gates
description: Use when enforcing 6 L4 quality gates before any phase can close. Loads the canonical gate definitions (test, security, RLS, i18n, RBAC, deploy). Saves ~70% tokens per gate check.
---

# Quality Gates — Token-Saver

## When to use

A phase is about to close. Must pass all 6 gates before:
- Code is merged
- Deploy to live
- Closeout doc written

## 6 L4 quality gates

| # | Gate | Pass condition | Check |
|---|---|---|---|
| G1 | **Tests** | All unit + integration tests pass; coverage ≥ 80% | npm test + nyc/coverage |
| G2 | **Security** | No secrets in commits, no XSS, no CSRF, no console.log of PHI | git scan + eslint + custom |
| G3 | **RLS** | Every new tenant-scoped table has FORCE_RLS + policy | SQL audit |
| G4 | **i18n** | All 4 locales 100% key coverage, no hardcoded strings | i18n_coverage.js + audit |
| G5 | **RBAC** | Every route has requireAuth + requireTenantScope + requireRole; no cross-specialty leakage | route audit |
| G6 | **Deploy** | Migration applied on sandbox, then live; smoke tests pass; PM2 reload OK | deploy pipeline |

## Gate 1 — Tests

```bash
cd namaweb
npm test 2>&1 | tee /tmp/test.log
grep -E "passing|failing|skipped" /tmp/test.log
# Must show: passing N>=expected, failing 0
```

Coverage:
```bash
npx nyc --reporter=text-summary node test/run.js
# Must show: % Statements >= 80%
```

## Gate 2 — Security

```bash
# No secrets in commits
git log --all --pretty=format: --name-only | sort -u | while read f; do
    if grep -qE "(BEGIN.*PRIVATE KEY|password\s*=\s*['\"][^'"]+|api[_-]?key\s*=\s*['\"][^'"]+)" "$f" 2>/dev/null; then
        echo "SECRET LEAK: $f"
    fi
done

# No XSS-prone patterns
grep -rE "(innerHTML\s*=|document\.write|eval\s*\()" namaweb/public/js/*.js | grep -v "SafeHtml" | grep -v "// SAFE:"

# No console.log of PHI
grep -rE "console\.(log|info|warn|error).*(patient|mrn|dob|ssn|national)" namaweb/public/js/*.js

# CSP doesn't have unsafe-eval/unsafe-inline (unless approved)
grep -E "(unsafe-eval|unsafe-inline)" namaweb/middleware/security.js
```

## Gate 3 — RLS

```sql
-- Find tables created in this phase without RLS
SELECT c.relname
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname NOT IN ('schema_migrations', 'pg_stat_statements', 'migrations')
  AND NOT c.relrowsecurity;

-- Find tables without FORCE RLS
SELECT c.relname
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relrowsecurity
  AND NOT (
      SELECT relforcerowsecurity FROM pg_class WHERE oid = c.oid
  );

-- Find tables with RLS but no policy
SELECT c.relname
FROM pg_class c
WHERE c.relkind = 'r' AND c.relrowsecurity = true
  AND c.relnamespace = 'public'::regnamespace
  AND NOT EXISTS (SELECT 1 FROM pg_policy p WHERE p.polrelid = c.oid);
```

## Gate 4 — i18n

```bash
node scripts/i18n_coverage.js | tee /tmp/i18n.log
grep -E "^(ar|en|fr|ur):" /tmp/i18n.log | while read line; do
    pct=$(echo "$line" | awk '{ print $2 }' | tr -d '()%')
    if [ "$pct" -lt 100 ]; then
        echo "i18n GAP: $line"
        exit 1
    fi
done

node scripts/i18n_audit_strings.js | tee /tmp/strings.log
if [ -s /tmp/strings.log ]; then echo "HARDCODED STRINGS FOUND"; exit 1; fi
```

## Gate 5 — RBAC

```bash
# Every router has requireAuth + requireTenantScope
for f in namaweb/*_router.js; do
    if ! grep -q "requireAuth" "$f"; then echo "G5 FAIL: $f missing requireAuth"; fi
    if ! grep -q "requireTenantScope" "$f"; then echo "G5 FAIL: $f missing requireTenantScope"; fi
    # Write routes must have requireRole + validateBody
    if grep -qE "router\.(post|put|delete)" "$f"; then
        if ! grep -q "requireRole" "$f"; then echo "G5 FAIL: $f write without requireRole"; fi
        if ! grep -q "validateBody" "$f"; then echo "G5 FAIL: $f write without validateBody"; fi
    fi
done

# No cross-specialty leak
grep -rE "requireSpecialtyAccess" namaweb/*_router.js
```

## Gate 6 — Deploy

```bash
# Sandbox migration first
ssh root@204.168.144.74 "psql -U nama_medical_app -d nama_medical_web_test -f /tmp/migration.sql"
# If sandbox fails, abort

# Live migration
ssh root@204.168.144.74 "cd /var/www/namaweb && psql ... -f migrations/eNN_up.sql"

# Restart
ssh root@204.168.144.74 "pm2 reload nama-medical-erp"

# Smoke tests
node scripts/smoke.js
# Must exit 0
```

## Gate matrix output

```
G1 (Tests):       PASS  (47/47, coverage 87%)
G2 (Security):    PASS  (no leaks)
G3 (RLS):         PASS  (3 tables, 3 policies)
G4 (i18n):        PASS  (ar 100%, en 100%, fr 100%, ur 100%)
G5 (RBAC):        PASS  (3 routers, all chain complete)
G6 (Deploy):      PASS  (smoke 7/7 green)

OVERALL: PASS — ready to close
```

## Gate failure escalation

| Gate | Severity | Escalation |
|---|---|---|
| G1 fail | BLOCKING | Cannot close; must fix all tests |
| G2 fail | BLOCKING | Cannot close; must remove secret/XSS/PHI |
| G3 fail | BLOCKING | Cannot close; must add RLS + policy |
| G4 fail (≥ 90%) | WARNING | Document gap; close with TODO |
| G4 fail (< 90%) | BLOCKING | Must complete to 100% |
| G5 fail | BLOCKING | Must add middleware |
| G6 fail | BLOCKING | Must rollback + retry |

## Token saving

Each gate check from scratch = ~150 lines. With template = ~40 lines unique
(specific tables, specific tests, specific locales). ~70% reduction.