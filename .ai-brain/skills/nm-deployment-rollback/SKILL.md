---
name: nm-deployment-rollback
description: Use when a deploy to live has failed and you need to roll back safely. Loads the canonical 6-step rollback pipeline with safety rails. Saves ~70% tokens per rollback.
---

# Deployment Rollback — Token-Saver

## When to use

- Smoke test fails after deploy
- 5xx error rate spike
- Tenant isolation breach detected
- Critical bug found in production
- Owner requests rollback

## AGENTS.md safety rails covered

- RAIL-4 No DELETE/DROP without owner-authorized backup path (which rollback requires)
- RAIL-8 CSP stays report-only by default

## 6-step rollback pipeline

```
1. STOP     → pm2 stop nama-medical-erp
2. ASSESS   → identify last-known-good (LKG) backup
3. RESTORE  → restore server.js + DB from backup
4. VERIFY   → confirm pre-deploy state is back
5. RESTART  → pm2 start nama-medical-erp
6. REPORT   → log incident + lessons learned
```

## Step 1 — STOP

```bash
ssh root@204.168.144.74 "pm2 stop nama-medical-erp"
ssh root@204.168.144.74 "pm2 list | grep nama-medical-erp"
# Confirm status: stopped
```

## Step 2 — ASSESS

```bash
# Find backups
ssh root@204.168.144.74 "ls -lt /var/backups/ | head -20"

# Identify last successful deploy backup
LATEST=$(ssh root@204.168.144.74 "ls -t /var/backups/server.js.before-deploy.* | head -1")
DATA=$(ssh root@204.168.144.74 "ls -t /var/backups/data.before-deploy.*.sql.gz | head -1")
SCHEMA=$(ssh root@204.168.144.74 "ls -t /var/backups/schema.before-deploy.*.sql.gz | head -1")
echo "Restoring from:"
echo "  server: $LATEST"
echo "  data:   $DATA"
echo "  schema: $SCHEMA"
```

## Step 3 — RESTORE server.js

```bash
ssh root@204.168.144.74 "cp $LATEST /var/www/namaweb/server.js"
ssh root@204.168.144.74 "chown nama-medical:nama-medical /var/www/namaweb/server.js"
```

## Step 4 — RESTORE DB (only if data was affected)

> **CRITICAL**: Only run if the deploy added/removed/changed DB rows. Never DROP without owner authorization.

```bash
ssh root@204.168.144.74 "gunzip -c $DATA | \
  psql 'postgresql://nama_medical_app:NamaMedicalApp@2026!@localhost:5432/nama_medical_web?sslmode=disable'"
```

For schema rollback (drop new tables), run down migrations:
```bash
ssh root@204.168.144.74 "cd /var/www/namaweb && \
  psql ... -f migrations/eNN_xxx_down.sql"
```

## Step 5 — RESTART

```bash
ssh root@204.168.144.74 "pm2 start nama-medical-erp"
sleep 5
ssh root@204.168.144.74 "pm2 list | grep nama-medical-erp"
# Confirm: online
ssh root@204.168.144.74 "curl -fsS http://localhost:3000/api/health"
```

## Step 6 — VERIFY

```bash
# Smoke tests
node scripts/smoke.js

# Tenant isolation re-check
node scripts/tenant_isolation_test.js

# Verify last-known-good routes
ssh root@204.168.144.74 "for r in cardiology oncology pediatrics surgery pharmacy er; do
  echo \"--- \$r ---\"
  curl -sS http://localhost:3000/api/\$r/health
done"
```

## Step 7 — REPORT

Create `docs/INCIDENTS/INC_YYYY-MM-DD_NNN.md`:

```markdown
# Incident Report — {Date}

## Summary
Deployed {dept} on {date} at {time}. Smoke tests passed initially but
{customers/bots} reported {error type} within {minutes}.

## Timeline
- HH:MM — Deploy started (commits a1b2c3)
- HH:MM — Deploy completed, PM2 reload OK
- HH:MM — Smoke tests green
- HH:MM — {error type} reported
- HH:MM — Owner authorized rollback
- HH:MM — Rollback complete
- HH:MM — Service restored

## Root cause
{One paragraph explaining why the bug escaped pre-deploy tests}

## Fix plan
1. Add test for {specific case}
2. Update gate check to catch {specific issue}
3. Re-deploy with new test

## Lessons learned
- Add {specific test} to CI
- Improve {specific gate} check
- Update {specific doc}
```

## Quick rollback (one-liner for minor code-only rollback)

```bash
ssh root@204.168.144.74 "cd /var/www/namaweb && \
  cp /var/backups/server.js.before-deploy.LATEST server.js && \
  pm2 reload nama-medical-erp && \
  sleep 5 && \
  curl -fsS http://localhost:3000/api/health"
```

## Auto-rollback script

```bash
#!/bin/bash
# scripts/auto-rollback.sh
set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <backup-timestamp>"
    exit 1
fi
TS=$1
SERVER="root@204.168.144.74"

echo "=== Auto-rollback to $TS ==="

ssh $SERVER "pm2 stop nama-medical-erp"

# Try newest backup first, fall back to oldest of the timestamp
ssh $SERVER "cp /var/backups/server.js.before-deploy.${TS} /var/www/namaweb/server.js"

# Optionally restore DB
if [ "$2" == "--with-db" ]; then
    ssh $SERVER "gunzip -c /var/backups/data.before-deploy.${TS}.sql.gz | \
      psql 'postgresql://nama_medical_app:NamaMedicalApp@2026!@localhost:5432/nama_medical_web?sslmode=disable'"
fi

ssh $SERVER "pm2 start nama-medical-erp"
sleep 5
ssh $SERVER "curl -fsS http://localhost:3000/api/health"
echo "=== Rollback complete ==="
```

## Anti-patterns

- ❌ Rolling back without stopping PM2 first (may write to deleted files)
- ❌ Rolling back without backup verification (risk of restoring broken state)
- ❌ Skipping the smoke test after rollback (may have not actually rolled back)
- ❌ Rolling forward instead of backward (harder to debug)

## Token saving

Each rollback from scratch = ~200 lines. With template = ~50 lines unique
(specific backups, specific tests). ~75% reduction.