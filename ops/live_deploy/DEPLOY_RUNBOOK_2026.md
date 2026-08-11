# Deployment Runbook — NamaMedical ERP (Hetzner Production)
# Filepath: ops/live_deploy/DEPLOY_RUNBOOK_2026.md
# Generated: 2026-08-08

# Deployment Runbook — v5 (60 Departments)

> **Production:** Hetzner `ubuntu-8gb-hel1-1` (204.168.144.74) · `jumanasoft.com`
> **Process:** PM2 `nama-medical-erp`
> **Branch:** `integration/all-epics`
> **Rollback target:** previous git tag (auto-retained)

---

## 1. Pre-Deploy Checklist

- [ ] All 264+ tests pass locally: `cd namaweb && npm run test:safe`
- [ ] Cross-tenant master test passes: `npm test -- cross_tenant_master_test.js`
- [ ] Owner authorization received (Signal 5 or explicit)
- [ ] Maintenance window scheduled (low-traffic hours: 02:00-04:00 UTC)
- [ ] Backup verified: `bash ops/live_deploy/backup_pre_deploy.sh`
- [ ] Current production tagged: `git tag prod-pre-deploy-$(date +%Y%m%d-%H%M%S)`

---

## 2. Deploy Steps (60 Departments × 35 Files Blueprint + Engines + Stations + Routers)

### 2.1 Pull & Build

```bash
ssh ubuntu@204.168.144.74
cd /opt/nama
git fetch origin
git checkout integration/all-epics
git pull
```

### 2.2 Install Dependencies

```bash
npm ci --only=production
```

### 2.3 Apply Migrations (124 new SQL files: 62 up + 62 down)

```bash
# Verify migration plan
psql -U nama_app -d nama_medical -c "SELECT filename FROM pg_migrations ORDER BY id DESC LIMIT 5;"

# Dry-run check (counts only)
bash ops/live_deploy/migration_count_check.sh e60_dept

# Apply in transaction
PGPASSWORD=$DB_PASSWORD psql -U nama_app -d nama_medical -v ON_ERROR_STOP=1 -f namaweb/migrations/e60_dept_DEP-001_up.sql
PGPASSWORD=$DB_PASSWORD psql -U nama_app -d nama_medical -v ON_ERROR_STOP=1 -f namaweb/migrations/e60_dept_DEP-002_up.sql
# ... (62 migrations)

# Verify RLS enabled
psql -U nama_app -d nama_medical -c "\d+ cardiology_encounters"
# Expected: "Row security: enabled, forced"
```

### 2.4 Verify Engines Loaded

```bash
# Sanity check engines
node -e "
const fs = require('fs');
const path = require('path');
const engines = fs.readdirSync('./namaweb').filter(f => f.endsWith('_engine.js'));
console.log('Engines loaded:', engines.length);
console.log('Sample:', engines.slice(0, 5));
"
# Expected: 102 engines
```

### 2.5 Verify Stations Loaded

```bash
ls namaweb/public/js/*-station.js | wc -l
# Expected: 80
```

### 2.6 Restart PM2 (zero-downtime reload)

```bash
pm2 reload nama-medical-erp --update-env
pm2 status nama-medical-erp
# Expected: "online" with restart count = 0 (or low)
```

### 2.7 Health Check

```bash
curl -s http://localhost:3000/health | jq .
# Expected: {"status": "ok", "uptime_seconds": ..., "depts": 60}

# Verify a sample route
curl -s -H "x-tenant-id: 1" http://localhost:3000/api/cardiology/list | jq '.ok'
# Expected: true
```

---

## 3. Smoke Tests (Post-Deploy)

### 3.1 Critical Path Tests

```bash
# Auth flow
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "smoke_test", "password": "test"}'

# Cross-tenant test (manual)
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"smoke","password":"smoke"}' | jq -r '.token')

curl -s -H "Authorization: Bearer $TOKEN" -H "x-tenant-id: 1" \
  http://localhost:3000/api/cardiology/list
# Expected: 200 OK

curl -s -H "Authorization: Bearer $TOKEN" -H "x-tenant-id: 2" \
  http://localhost:3000/api/cardiology/list
# Expected: 200 OK with different items
```

### 3.2 Station Load Test

```bash
# Open browser
# Navigate to https://jumanasoft.com
# Click on "Cardiology" station — should load in < 1s
# Repeat for: Endocrinology, Pediatrics, Pharmacy, Billing
```

### 3.3 AI/RAG Test

```bash
# Test RAG pipeline (requires OPENAI_API_KEY)
curl -s -X POST http://localhost:3000/api/cardiology/ai/diagnose \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-tenant-id: 1" \
  -H "Content-Type: application/json" \
  -d '{"question": "ما هو علاج الذبحة الصدرية المستقرة؟"}'

# Expected: JSON with "answer" and "sources" fields, latency < 2s
```

---

## 4. Monitoring (First 24 Hours)

### 4.1 Metrics to Watch

- **Request rate** (Grafana → Overview): Should match pre-deploy baseline ±10%
- **Error rate** (5xx): Should be < 0.1%
- **p95 latency**: Should be < 200ms (excluding AI endpoints)
- **DB connection pool**: Should be < 80% utilized
- **Memory usage**: Should stabilize (no leaks)

### 4.2 Logs to Watch

```bash
pm2 logs nama-medical-erp --lines 100 --nostream
# Look for: unhandledRejection, TypeError, ECONNREFUSED, PHI leak warnings
```

### 4.3 Alerts Active

```bash
# Check Alertmanager
curl -s http://localhost:9093/api/v1/alerts | jq '.data[] | {labels, status}'
```

---

## 5. Rollback Procedure

### 5.1 Fast Rollback (< 5 minutes)

```bash
# Roll back to previous git tag
cd /opt/nama
git checkout prod-pre-deploy-$(date +%Y%m%d-%H%M%S)
npm ci --only=production
pm2 reload nama-medical-erp --update-env

# Rollback migrations (down files)
PGPASSWORD=$DB_PASSWORD psql -U nama_app -d nama_medical -v ON_ERROR_STOP=1 \
  -f namaweb/migrations/e60_dept_DEP-062_down.sql
# ... (62 down files)

# Verify
curl -s http://localhost:3000/health
```

### 5.2 Full Restore (if DB corrupted)

```bash
# Restore from backup
bash ops/live_deploy/restore_db.sh /opt/backups/nama_medical_pre_deploy.sql.gz
pm2 reload nama-medical-erp --update-env
```

---

## 6. Post-Deploy Tasks

### 6.1 Tag the Release

```bash
git tag prod-release-$(date +%Y%m%d-%H%M%S) -m "Wave 49: 60 depts × 35 files"
git push origin --tags
```

### 6.2 Update CHANGELOG

Already done in `CHANGELOG.md` (Wave 49 entry).

### 6.3 Notify Stakeholders

- Email: board, clinical leads, IT team
- Slack: #nama-deploys, #clinical-users
- WhatsApp: ops team group

### 6.4 Schedule RAG Ingestion (optional, +$900)

```bash
# One-time, runs in background
nohup python .ai-brain/03_AUTOPILOT/rag_ingest_all.py > /var/log/rag_ingest.log 2>&1 &
# Estimated time: 4-8 hours (60 depts × ~5 min each)
```

---

## 7. Owner Sign-off Checklist

| # | Item | Verified |
|---|---|---|
| 1 | All tests pass | ☐ |
| 2 | Migration applied cleanly | ☐ |
| 3 | PM2 reload successful | ☐ |
| 4 | Health endpoint returns 200 | ☐ |
| 5 | Cross-tenant test passes | ☐ |
| 6 | RLS enforced on new tables | ☐ |
| 7 | No PHI in logs (audit grep) | ☐ |
| 8 | Grafana dashboards load | ☐ |
| 9 | Alerts fire on test failure | ☐ |
| 10 | Stakeholders notified | � |

---

## 8. Support Contacts

| Role | Person | Phone | Email |
|---|---|---|---|
| Owner | (you) | — | — |
| DevOps Lead | TBD | — | — |
| Backend Lead | TBD | — | — |
| On-call (24/7) | Rotating | +966-XXX | ops@jumanasoft.com |

---

**Generated:** 2026-08-08 · **Reviewer:** Owner
