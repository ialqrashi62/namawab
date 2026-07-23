# GI-001 — CI/CD

```yaml
name: GI-001 Deploy
on:
  push: [main, integration/gi]
jobs:
  test: { runs-on: ubuntu-latest, steps: [actions/checkout@v4, npm ci, npm test -- gi] }
  deploy-staging: { needs: test, steps: [deploy_staging.sh gi] }
  deploy-prod: { needs: deploy-staging, environment: production, steps: [backup_db.sh, deploy_prod.sh gi] }
```

## Rollback
```bash
pm2 stop nama-medical-erp
psql -U nama_medical_app -d nama_medical -f migrations/e107_gi_module_down.sql
pm2 start nama-medical-erp
```

## Health
```bash
curl https://jumanasoft.com/api/gi/health
```

## Post-Deploy Monitoring
- Hour 1: bleed protocol
- Hour 4: endoscopy
- Hour 24: liver scores
- Day 7: HCV SVR, readmission
