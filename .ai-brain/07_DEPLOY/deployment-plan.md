# Deployment Plan — NamaMedical ERP
# Filepath: .ai-brain/07_DEPLOY/deployment-plan.md
# Generated: 2026-08-08

# Deployment Plan

> **Environments:** Local → Sandbox → Staging → Production
> **Promotion:** Automated via GitHub Actions
> **Rollback:** Within 5 minutes

---

## 1. Environments

### 1.1 Local (Developer)
- **URL:** `http://localhost:3000`
- **DB:** Local Postgres + Redis
- **Auth:** admin / admin (dev only)
- **Seeds:** Dummy patients (no PHI)
- **RAG:** OpenAI dev key (rate-limited)

### 1.2 Sandbox (Testing)
- **URL:** `https://sandbox.jumanasoft.com`
- **DB:** Sandbox DB (weekly reset)
- **Auth:** Sandbox accounts
- **Seeds:** Dummy data
- **RAG:** Mock LLM (cost-controlled)

### 1.3 Staging (Pre-Production)
- **URL:** `https://staging.jumanasoft.com`
- **DB:** Staging DB (anonymized prod copy)
- **Auth:** Real test accounts
- **Seeds:** Real schema, dummy data
- **RAG:** Real OpenAI (with budget cap)

### 1.4 Production
- **URL:** `https://jumanasoft.com`
- **DB:** Production (Hetzner, encrypted)
- **Auth:** Production MFA enforced
- **Seeds:** No fixtures; real customers only
- **RAG:** Real OpenAI (per-tenant budget)

---

## 2. Promotion Pipeline

```
Local → Sandbox (auto on push)
       ↓
       Staging (manual approval)
       ↓
       Production (owner approval)
```

### 2.1 Sandbox (Automatic)
```yaml
on:
  push:
    branches: [main, integration/*]
jobs:
  deploy-sandbox:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deploy.sh sandbox
```

### 2.2 Staging (Manual)
- PR from `integration/all-epics` to `staging` branch
- Auto-runs test suite
- Requires 1 approval
- Auto-deploy after approval

### 2.3 Production (Owner Approval)
- PR from `staging` to `main`
- Full test suite + pentest
- **Requires owner approval (Signal 5 or explicit)**
- Scheduled maintenance window (02:00-04:00 UTC)
- Rollback plan ready

---

## 3. Deployment Steps (Detailed)

### 3.1 Pre-Deploy
```bash
# 1. Verify tests pass
cd namaweb
npm run test:safe
npm test -- cross_tenant_master_test.js

# 2. Backup current DB
bash ops/live_deploy/backup_pre_deploy.sh

# 3. Tag current production
git tag prod-pre-deploy-$(date +%Y%m%d-%H%M%S)

# 4. Notify team
./scripts/notify_deploy.sh "Wave 49: 60 depts"
```

### 3.2 Deploy
```bash
# 1. SSH to production
ssh ubuntu@204.168.144.74

# 2. Pull code
cd /opt/nama
git fetch && git checkout integration/all-epics && git pull

# 3. Install deps
npm ci --only=production

# 4. Apply migrations
psql -U nama_app -d nama_medical -f migrations/e60_dept_*.sql

# 5. Verify RLS
psql -U nama_app -d nama_medical -c "\d+ cardiology_encounters"

# 6. PM2 reload (zero-downtime)
pm2 reload nama-medical-erp --update-env

# 7. Health check
curl http://localhost:3000/health
```

### 3.3 Post-Deploy
```bash
# 1. Smoke tests
curl http://localhost:3000/api/cardiology/list -H "x-tenant-id: 1"

# 2. Monitor for 30 min
tail -f /var/log/pm2/nama-medical-erp-out.log

# 3. Tag release
git tag prod-release-$(date +%Y%m%d-%H%M%S)
git push --tags

# 4. Update CHANGELOG (already done)

# 5. Notify success
./scripts/notify_deploy_complete.sh
```

---

## 4. Rollback Plan

### 4.1 Fast Rollback (Code)
```bash
ssh ubuntu@204.168.144.74
cd /opt/nama
git checkout prod-pre-deploy-20260808-020000
npm ci --only=production
pm2 reload nama-medical-erp --update-env
```

### 4.2 DB Rollback (Migrations)
```bash
# Apply down migrations
psql -U nama_app -d nama_medical -f migrations/e60_dept_*_down.sql
```

### 4.3 Full Restore
```bash
# Stop app
pm2 stop nama-medical-erp

# Restore DB
bash ops/live_deploy/restore_db.sh /opt/backups/nama_medical_20260807.sql.gz

# Start app
pm2 start nama-medical-erp
```

### 4.4 Rollback Decision Tree

| Symptom | Action |
|---|---|
| Error rate > 5% | Immediate rollback |
| Latency p95 > 1s | Investigate, rollback if persists > 10 min |
| RLS violation detected | Immediate rollback + security review |
| Migration failure | Rollback DB only |
| AI/LLM down | Disable AI endpoints, keep app |

---

## 5. Smoke Tests (Post-Deploy)

### 5.1 Critical Path
```bash
# 1. Auth
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"smoke","password":"smoke"}'

# 2. Each dept list
for dept in cardiology emergency pharmacy billing; do
  curl -s -H "x-tenant-id: 1" \
    http://localhost:3000/api/$dept/list | jq '.ok'
done

# 3. AI diagnosis (RAG)
curl -X POST http://localhost:3000/api/cardiology/ai/diagnose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-tenant-id: 1" \
  -d '{"question":"chest pain"}'
```

### 5.2 UI Verification
```bash
# Open browser
# 1. Login
# 2. Click each station (60 stations)
# 3. Verify RTL + Arabic
# 4. Verify AI button works
# 5. Verify AI returns answer in <2s
```

---

## 6. Deployment Cadence

| Type | Frequency | Time | Owner |
|---|---|---|---|
| **Hotfix** | As needed | Any | On-call |
| **Patch** | Weekly | Tuesday 02:00 UTC | DevOps |
| **Feature** | Bi-weekly | Sprint end | Owner |
| **Major** | Quarterly | Maintenance window | Owner + Team |

---

## 7. Monitoring & Alerting (Post-Deploy)

### 7.1 Watch for 24 hours
- Request rate (should match pre-deploy baseline ±10%)
- Error rate (target < 0.1%)
- p95 latency (target < 200ms)
- DB connection pool (target < 80% utilized)
- Memory usage (should stabilize)
- Audit log writes (should be continuous)
- RAG token usage (per-tenant budget)

### 7.2 Alerts Active
- HighErrorRate → Page on-call
- DatabaseDown → Page CTO
- RLSViolationSpike → Page Security
- AuditChainBreak → Page Compliance

### 7.3 Rollback Triggers
- Error rate > 5% for > 5 min
- p95 latency > 2x baseline for > 15 min
- Any RLS violation detected
- Audit chain integrity failure

---

**Generated:** 2026-08-08 · **Owner:** DevOps Team
