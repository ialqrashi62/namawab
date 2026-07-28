# 37 — Deployment Runbook (CARD-001)

> Owner: DSL · Tier 1

## Pre-deploy checklist

- [ ] All tests pass (unit + integration + e2e + cross-tenant)
- [ ] All migrations have up + down + validate
- [ ] All migrations tested on staging
- [ ] Migrations runnable in any order
- [ ] All money routes have idempotency + audit
- [ ] All RLS policies enabled + FORCE RLS
- [ ] All routes have Auth + T + Role + VB (money: + IDM)
- [ ] No hardcoded secrets
- [ ] No PHI in fixtures
- [ ] LLM cost per tenant within cap
- [ ] Audit log enabled (or opt-in flag reviewed)
- [ ] Backup taken pre-deploy
- [ ] Rollback plan ready

## Deployment steps (staging)

```bash
# 1. SSH to staging
ssh nama-medical@204.168.144.74

# 2. Pre-deploy backup
cd /opt/nama-medical
./ops/live_deploy/backup_db.sh

# 3. Pull latest
cd namaweb
git fetch origin
git checkout integration/all-epics
git pull

# 4. Install deps
npm ci --production

# 5. Run migrations (forward)
PGPASSWORD=$PGPASSWORD psql -U nama_medical_app -d nama_medical_web -f migrations/<e50_cardio_v1>_up.sql

# 6. Validate migrations
PGPASSWORD=$PGPASSWORD psql -U nama_medical_app -d nama_medical_web -f migrations/<e50_cardio_v1>_validate.sql

# 7. Build CSS
npm run build:css

# 8. Smoke tests
node e2e_local_smoke_test.js

# 9. Restart PM2
pm2 reload nama-medical-erp

# 10. Verify
pm2 logs nama-medical-erp --lines 50
curl -k https://jumanasoft.com/healthz
```

## Smoke tests (post-deploy)

```yaml
smoke_tests:
  - { name: login, endpoint: /login, expect: 200 }
  - { name: dashboard, endpoint: /api/dashboard/main, expect: 200, auth: required }
  - { name: cardiology_encounter_list, endpoint: /api/cardiology/encounters, expect: 200, auth: required, role: cardiology }
  - { name: cardiology_ecg_upload, endpoint: /api/cardiology/ecg, method: POST, expect: 201, auth: required, role: cardiology }
  - { name: copilot_query, endpoint: /api/cardiology/copilot/query, method: POST, expect: 200, auth: required, role: cardiology }
  - { name: red_flag_activate, endpoint: /api/cardiology/red-flags/STEMI/activate, method: POST, expect: 201, auth: required, role: cardiology, body: { patient_id, encounter_id, severity: critical } }
  - { name: nphies_eligibility, endpoint: /api/cardiology/nphies/eligibility, method: GET, expect: 200, auth: required, role: billing }
  - { name: cross_tenant_block, endpoint: /api/cardiology/encounters (other_tenant_patient_id), expect: 403, auth: required }
  - { name: rate_limit, endpoint: /api/cardiology/encounters, burst: 200, expect: 429 }
  - { name: healthz, endpoint: /healthz, expect: 200 }
  - { name: liveness, endpoint: /healthz/live, expect: 200 }
  - { name: readiness, endpoint: /healthz/ready, expect: 200 }
```

## Rollback

```bash
# 1. Stop app
pm2 stop nama-medical-erp

# 2. Rollback migration (if needed)
PGPASSWORD=$PGPASSWORD psql -U nama_medical_app -d nama_medical_web -f migrations/<e50_cardio_v1>_down.sql

# 3. Rollback code
git checkout <previous-tag>

# 4. Reinstall
npm ci --production

# 5. Restart
pm2 reload nama-medical-erp

# 6. Verify smoke tests pass

# 7. If DB rollback was destructive, restore from backup
./ops/live_deploy/restore_db.sh /opt/nama-medical/backups/<timestamp>.sql
```

## Post-deploy (24h)

- [ ] Error rate < 0.1%
- [ ] p95 latency < 500ms
- [ ] No PHI in logs
- [ ] No security alerts
- [ ] Backup verified
- [ ] LLM cost guard within cap
- [ ] Cross-tenant test pass on prod traffic
- [ ] Owner sign-off

## Production-specific

- HTTPS enforced (no HTTP-only fallback)
- All secrets in Vault (not .env)
- Audit log enabled
- Monitoring alerts on
- LLM observability traces flowing
- On-call rotation defined
