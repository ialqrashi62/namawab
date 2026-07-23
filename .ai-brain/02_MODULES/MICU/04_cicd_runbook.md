# MICU — CI/CD Runbook

## Pre-Deploy Checklist
- [ ] All unit tests pass (50+)
- [ ] Integration tests pass (15+)
- [ ] E2E Playwright pass (5+)
- [ ] Migration tested in staging
- [ ] RLS + FORCE_RLS verified
- [ ] PHI redaction verified
- [ ] Audit log tested
- [ ] L4 6/6 validation green

## Deploy Stages
```yaml
# .github/workflows/micu-deploy.yml
name: MICU Deploy
on:
  push:
    branches: [main, integration/micu]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test -- micu
      - run: npm run test:integration -- micu
      - run: npm run lint

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: ./deploy_staging.sh micu
      - run: ./verify_health.sh micu
      - run: ./run_smoke_tests.sh micu

  deploy-prod:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./backup_db.sh
      - run: ./deploy_prod.sh micu
      - run: ./verify_health.sh micu
      - run: ./run_smoke_tests.sh micu
      - run: ./notify_slack.sh "MICU deployed"
```

## Rollback
```bash
# If error:
pm2 stop nama-medical-erp
psql -U nama_medical_app -d nama_medical -f migrations/e101_micu_module_down.sql
pm2 start nama-medical-erp
```

## Health Checks
```bash
curl https://jumanasoft.com/api/micu/health
# Returns: { "ok": true, "admissions": 12, "active": 8 }
```

## Post-Deploy Monitoring
- **Hour 1:** Bundle compliance check (sepsis, ARDS)
- **Hour 4:** Vent weaning attempt rate
- **Hour 24:** Audit log integrity check
- **Day 7:** Mortality rate vs pre-deploy
