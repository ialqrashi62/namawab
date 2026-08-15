# P0-1 Patient Portal — Deployment Runbook

## Pre-Deployment
- [ ] Tests pass (24 unit + 4 integration + 24 BDD)
- [ ] Migrations tested on staging
- [ ] Smoke green
- [ ] Security scan clean
- [ ] PDPL compliance reviewed
- [ ] Owner approval

## Migration
```bash
psql -U nama_medical_app -d nama_medical_web -f migrations/p0_1_patient_portal_*.sql
```

## Deploy
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/p0_1_patient_portal_engine.js \
  namaweb/pp_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/pp', require('./pp_router')); } catch(e) { console.error('pp mount failed', e.message); }

scp -i C:\Users\ice\.ssh\nama_medical_key server.js root@204.168.144.74:/var/www/namaweb/

ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 \
  "cd /var/www/namaweb && pm2 reload nama-medical-erp --silent && sleep 3 && curl -s -o /dev/null -w 'pp=%{http_code}\n' http://localhost:3000/api/pp/health"
```

## Verification
- [ ] /api/pp/health returns 200 (no auth for health)
- [ ] Nafath integration test
- [ ] Mawid booking test
- [ ] Wateen insurance verify
- [ ] All 5 RLS tables queryable
- [ ] Critical lab requires clinician verification
- [ ] Controlled substance blocked

## Rollback
- Comment out mount
- pm2 reload
- DROP tables (only if no real data)

## Post-Deployment
- [ ] Smoke test all 12 endpoints
- [ ] Verify PDPL consent flow
- [ ] Test critical lab alert
- [ ] Monitor 24h
- [ ] Update CHANGELOG

## Incident
- If PHI leak → immediate PDPL notification (72h)
- If critical lab missed → audit, contact patient
- If telehealth breach → kill session, investigate
