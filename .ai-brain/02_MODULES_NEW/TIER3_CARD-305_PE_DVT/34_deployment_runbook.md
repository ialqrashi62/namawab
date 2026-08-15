# CARD-305_PE_DVT — Deployment Runbook

## Pre-Deployment
- [ ] Tests pass
- [ ] Migrations tested on staging
- [ ] Smoke green
- [ ] Security scan clean

## Migration
```bash
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_305_pe_dvt_*.sql
```

## Deploy
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/tier3_card_305_pe_dvt_engine.js \
  namaweb/pedvt_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/pedvt', require('./pedvt_router')); } catch(e) { console.error('pedvt mount failed', e.message); }

ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 \
  "cd /var/www/namaweb && pm2 reload nama-medical-erp --silent && sleep 3 && curl -s -o /dev/null -w 'pedvt=%{http_code}\n' http://localhost:3000/api/pedvt/health"
```

## Verification
- [ ] /api/pedvt/health returns 401
- [ ] All 3 RLS tables queryable
- [ ] Scoring endpoints work

## Rollback
- Comment out mount, pm2 reload, DROP tables

## Incident
- If massive PE missed → PERT activation, thrombolysis
- If thrombolysis bleeding → reverse, hold anticoagulation
