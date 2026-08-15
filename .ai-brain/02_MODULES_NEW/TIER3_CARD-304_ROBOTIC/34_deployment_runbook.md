# CARD-304_ROBOTIC — Deployment Runbook

## Pre-Deployment
- [ ] Tests pass
- [ ] Migrations tested on staging
- [ ] Smoke green
- [ ] Security scan clean
- [ ] Owner approval

## Migration
```bash
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_304_robotic_*.sql
```

## Deploy
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/tier3_card_304_robotic_engine.js \
  namaweb/rcv_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/rcv', require('./rcv_router')); } catch(e) { console.error('rcv mount failed', e.message); }

scp -i C:\Users\ice\.ssh\nama_medical_key server.js root@204.168.144.74:/var/www/namaweb/

ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 \
  "cd /var/www/namaweb && pm2 reload nama-medical-erp --silent && sleep 3 && curl -s -o /dev/null -w 'rcv=%{http_code}\n' http://localhost:3000/api/rcv/health"
```

## Verification
- [ ] /api/rcv/health returns 401 (auth gate)
- [ ] Authenticated /api/rcv/cases returns 200
- [ ] All 4 RLS tables queryable
- [ ] STS scoring returns expected values

## Rollback
- Comment out mount
- pm2 reload
- DROP tables (only if no real data)

## Post-Deployment
- [ ] Smoke test all 14 endpoints
- [ ] Verify scoring
- [ ] Monitor 24h
- [ ] Update CHANGELOG

## Incident
- If surgical complication → MDT review, document
- If device failure → SFDA report, recall
- If conversion to open → audit, surgeon review
