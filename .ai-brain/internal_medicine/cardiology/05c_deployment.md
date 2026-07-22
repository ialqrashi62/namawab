# Deployment — Cardiology

> **Owner:** DevOps
> **Date:** 2026-07-22

---

## Pre-deploy

1. **Backup DB** — `restore_db.sh` + pre-deploy snapshot
2. **Migrations dry-run** on staging
3. **Smoke test** all routes (curl)
4. **Verify feature flag** — `CARDIOLOGY_CDS_ENABLED=false` initially
5. **Notify** clinical lead + on-call team

## Migration Order

```sql
-- e70_cardiology_tables_up.sql
BEGIN;
  CREATE TABLE cardiac_procedures (...);
  CREATE TABLE echo_reports (...);
  -- ...
  ALTER TABLE cardiac_procedures ENABLE ROW LEVEL SECURITY;
  ALTER TABLE cardiac_procedures FORCE ROW LEVEL SECURITY;
  CREATE POLICY tenant_isolation ON cardiac_procedures
    USING (tenant_id = current_setting('app.tenant_id')::BIGINT);
  -- ... for each new table
COMMIT;
```

## Deploy

```bash
# 1. Stop PM2
pm2 stop nama-medical-erp

# 2. Rsync new code
rsync -av --exclude='.env' --exclude='node_modules' \
  /repo/namaweb/ /var/www/namaweb/

# 3. Run migrations
psql -U nama_medical_app -d nama_medical_web \
  -f /var/www/namaweb/migrations/e70_cardiology_tables_up.sql

# 4. Verify syntax
node --check /var/www/namaweb/server.js

# 5. Re-embed guidelines (one-time, takes ~10 min)
node /var/www/namaweb/scripts/reembed_cardiology.js

# 6. Start PM2
pm2 start nama-medical-erp --update-env

# 7. Health check
curl -s http://127.0.0.1:3000/api/health
# expect: {"status":"UP","db":"up"}

# 8. Smoke test
curl -s -X POST http://127.0.0.1:3000/api/cardiology/cds/chadsvasc \
  -H "Content-Type: application/json" \
  -d '{"age":65,"chf":true,"htn":true,"diabetes":true,"stroke":false,"vascular":false,"sex":"male"}'
# expect: 200 with calculated score
```

## Feature Flag Rollout

- **Hour 0:** `CARDIOLOGY_CDS_ENABLED=false` → only deterministic (no LLM)
- **Hour 24:** turn on for cardiology_doctor role only
- **Hour 72:** turn on for cardiology_nurse
- **Hour 168 (1 week):** turn on for everyone

## Rollback

```bash
# 1. Stop PM2
pm2 stop nama-medical-erp

# 2. Restore server.js from backup
cp /root/nama_backups/pre_cardiology_<STAMP>/server.js.pre /var/www/namaweb/server.js

# 3. Rollback migration (down.sql)
psql -U nama_medical_app -d nama_medical_web \
  -f /var/www/namaweb/migrations/e70_cardiology_tables_down.sql

# 4. Start PM2
pm2 start nama-medical-erp --update-env
```

## RTO / RPO

- **RTO:** 5 minutes
- **RPO:** 1 hour (DB backup interval)

## Monitoring (post-deploy)

- [ ] Check pm2 logs for errors (last 100 lines)
- [ ] Check LangFuse dashboard — first 24h
- [ ] Verify CDS latency p95 <2s
- [ ] Verify echo upload working
- [ ] Check door-to-balloon timer (if any STEMI cases)

---

End of deployment plan.
