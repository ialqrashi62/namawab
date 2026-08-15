# CARD-301_STROKE — Deployment Runbook

## Pre-Deployment Checklist

- [ ] All tests pass (`npm test`)
- [ ] Migrations applied to staging (`npm run migrate:up`)
- [ ] Migrations tested with rollback (`npm run migrate:down` + `up`)
- [ ] Smoke test passes on staging
- [ ] Security scan (npm audit) clean
- [ ] Approval from owner + CMO

## Migration Sequence

```bash
# 1. Apply migrations to live DB
cd /var/www/namaweb
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_301_stroke_stroke_cases_up.sql
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_301_stroke_thrombolysis_up.sql
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_301_stroke_thrombectomy_up.sql
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_301_stroke_imaging_up.sql
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_301_stroke_followup_up.sql

# 2. Verify RLS
psql -c "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'stroke_%' AND rowsecurity = true"
```

## Deploy Steps

```bash
# 1. Copy engine + router
cd C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb
scp -i C:\Users\ice\.ssh\nama_medical_key tier3_card_301_stroke_engine.js root@204.168.144.74:/var/www/namaweb/
scp -i C:\Users\ice\.ssh\nama_medical_key stroke_router.js root@204.168.144.74:/var/www/namaweb/

# 2. Mount in server.js (add after existing mounts)
# try { app.use('/api/stroke', require('./stroke_router')); } catch(e) { console.error('stroke mount failed', e.message); }

# 3. Deploy server.js
scp -i C:\Users\ice\.ssh\nama_medical_key server.js root@204.168.144.74:/var/www/namaweb/

# 4. Reload
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 "cd /var/www/namaweb && pm2 reload nama-medical-erp --silent && sleep 3 && curl -s -o /dev/null -w 'stroke=%{http_code}\n' http://localhost:3000/api/stroke/health"
```

## Verification

```bash
# 1. Health check (401 expected — auth gate)
curl -s -o /dev/null -w 'stroke=%{http_code}\n' https://jumanasoft.com/api/stroke/health

# 2. With auth (admin session)
SESSION_COOKIE="connect.sid=..."
curl -s -b "$SESSION_COOKIE" https://jumanasoft.com/api/stroke/cases | jq

# 3. Scoring test
curl -s -X POST -H "Content-Type: application/json" -b "$SESSION_COOKIE" \
  -d '{"consciousness":0,"gaze":0,"visual_fields":0,"facial_palsy":0,"motor_arm_left":0,"motor_arm_right":0,"motor_leg_left":0,"motor_leg_right":0,"limb_ataxia":0,"sensory":0,"language":0,"dysarthria":0,"extinction":0}' \
  https://jumanasoft.com/api/stroke/score/nihss | jq
```

## Rollback

```bash
# 1. Disable mount
# In server.js, comment out: // app.use('/api/stroke', require('./stroke_router'));

# 2. Reload
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 "cd /var/www/namaweb && pm2 reload nama-medical-erp --silent"

# 3. Rollback migrations (only if no real data)
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_301_stroke_followup_down.sql
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_301_stroke_imaging_down.sql
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_301_stroke_thrombectomy_down.sql
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_301_stroke_thrombolysis_down.sql
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_301_stroke_stroke_cases_down.sql
```

## Post-Deployment

- [ ] Smoke test all 17 endpoints
- [ ] Verify NIHSS scores match expected
- [ ] Verify Tenecteplase dose calc
- [ ] Verify RLS active on all 5 tables
- [ ] Monitor error rate for 24h
- [ ] Update `docs/CHANGELOG.md`

## Incident Playbook

If DNT SLA fails (>60 min):
1. Check Code Stroke activation logs
2. Review CT turnaround time
3. Verify drug availability
4. Notify stroke coordinator
5. Root cause analysis within 7 days

If Tenecteplase dose error:
1. Stop infusion immediately
2. Notify stroke neurologist
3. Check NIHSS for hemorrhagic transformation
4. Document incident
5. File CAPA within 48h
