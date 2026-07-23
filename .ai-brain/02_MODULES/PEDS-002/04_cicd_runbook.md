# PEDS-002 — CI/CD + Helpdesk

## Pre-Deploy Checklist
- [ ] Unit tests (18+)
- [ ] Integration tests (10+)
- [ ] E2E tests (4+)
- [ ] Migration tested
- [ ] RLS verified
- [ ] Weight-based dose validator tested
- [ ] High-alert double-check working
- [ ] L4 6/6 PASS

## Deploy
```yaml
name: PEDS-002 Deploy
on:
  push:
    branches: [main, integration/peds]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- peds
  deploy-staging:
    needs: test
    steps:
      - run: ./deploy_staging.sh peds
  deploy-prod:
    needs: deploy-staging
    environment: production
    steps:
      - run: ./backup_db.sh
      - run: ./deploy_prod.sh peds
```

## Rollback
```bash
pm2 stop nama-medical-erp
psql -U nama_medical_app -d nama_medical -f migrations/e103_peds_nicu_down.sql
pm2 start nama-medical-erp
```

## Health
```bash
curl https://jumanasoft.com/api/peds/nicu/health
# { "ok": true, "admissions": 25, "onVent": 8 }
```

## Helpdesk
- **L1:** Login, slow, cannot see patient
- **L2:** Wrong weight, dose error, vent issue
- **L3:** RLS violation, dose system fail, audit log corruption
- **On-call:** Neonatologist + IT

## Runbook
- **Dose calculator fails:** Use Broselow tape (printed backup)
- **Vent alarm:** Manual ventilation, call RT
- **Apnea event:** Stimulate, caffeine review
- **PHI leak:** STOP service, DPO
