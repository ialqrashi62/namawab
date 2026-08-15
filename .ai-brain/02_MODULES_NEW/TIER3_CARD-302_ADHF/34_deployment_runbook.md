# CARD-302_ADHF — Deployment Runbook

## Pre-Deployment
- [ ] Tests pass
- [ ] Migrations tested on staging
- [ ] Smoke test green
- [ ] Security scan clean
- [ ] Owner approval

## Migration
```bash
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_302_ahf_*.sql
```

## Deploy
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/tier3_card_302_ahf_engine.js \
  namaweb/ahf_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/ahf', require('./ahf_router')); } catch(e) { console.error('ahf mount failed', e.message); }

scp -i C:\Users\ice\.ssh\nama_medical_key server.js root@204.168.144.74:/var/www/namaweb/

ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 \
  "cd /var/www/namaweb && pm2 reload nama-medical-erp --silent && sleep 3 && curl -s -o /dev/null -w 'ahf=%{http_code}\n' http://localhost:3000/api/ahf/health"
```

## Verification
- [ ] /api/ahf/health returns 401 (auth gate)
- [ ] Authenticated /api/ahf/cases returns 200
- [ ] All 5 RLS tables queryable
- [ ] GDMT scoring returns 4/4 for HFrEF

## Rollback
- Comment out mount
- pm2 reload
- DROP tables (only if no real data)

## Post-Deployment
- [ ] Smoke test all 25 endpoints
- [ ] Verify scoring
- [ ] Monitor 24h
- [ ] Update CHANGELOG

## Incident
- If GDMT dose error → stop drug, notify cardiologist, document
- If LVAD thrombosis suspected → urgent LVAD team review
- If transplant rejection → treat per ISHLT guideline
