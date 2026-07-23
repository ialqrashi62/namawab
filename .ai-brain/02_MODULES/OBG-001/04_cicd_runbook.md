# OBG-001 — CI/CD Runbook

## Pre-Deploy Checklist
- [ ] Unit tests (30+)
- [ ] Integration tests (12+)
- [ ] E2E tests (4+)
- [ ] Migration tested in staging
- [ ] RLS + FORCE_RLS verified
- [ ] PHI redaction verified (pregnancy data = special category)
- [ ] Audit log tested
- [ ] L4 6/6 validation green
- [ ] Maternal + perinatal mortality reporting config

## Deploy Stages
```yaml
name: OBG-001 Deploy
on:
  push:
    branches: [main, integration/obg]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- obg
      - run: npm run test:integration -- obg
      - run: npm run lint
  deploy-staging:
    needs: test
    steps:
      - run: ./deploy_staging.sh obg
  deploy-prod:
    needs: deploy-staging
    environment: production
    steps:
      - run: ./backup_db.sh
      - run: ./deploy_prod.sh obg
      - run: ./verify_health.sh obg
```

## Rollback
```bash
pm2 stop nama-medical-erp
psql -U nama_medical_app -d nama_medical -f migrations/e102_obg_module_down.sql
pm2 start nama-medical-erp
```

## Health Checks
```bash
curl https://jumanasoft.com/api/obg/health
# Returns: { "ok": true, "pregnancies": 234, "dueThisWeek": 12 }
```

## Post-Deploy Monitoring
- **Hour 1:** PPH rate, eclampsia rate
- **Hour 4:** C-section rate
- **Hour 24:** Maternal + perinatal mortality
- **Day 7:** Audit log integrity, GDM control rate
