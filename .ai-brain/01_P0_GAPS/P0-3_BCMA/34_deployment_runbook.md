# P0-3 BCMA — Deployment Runbook

## Pre-Deployment

1. Apply migration: `psql -f migrations/e146_bcma_up.sql`
2. Verify FORCE RLS: `\d+ bcma_mar_entries` (rowsecurity=on, forcerowsecurity=on)
3. Seed test data: `node seeders/bcma_seed.js`

## Deployment

```bash
# Copy new code
scp bcma_router.js p0_3_bcma_engine.js root@server:/var/www/namaweb/
scp migrations/e146_bcma_up.sql root@server:/var/www/namaweb/migrations/

# On server
cd /var/www/namaweb
psql -U nama_medical_app -d nama_medical_web -f migrations/e146_bcma_up.sql
pm2 reload nama-medical-erp
```

## Smoke Test

```bash
curl -sk https://jumanasoft.com/api/bcma/health
```

## Rollback

```bash
pm2 revert nama-medical-erp
psql -U nama_medical_app -d nama_medical_web -c "DROP TABLE IF EXISTS bcma_* CASCADE;"
```