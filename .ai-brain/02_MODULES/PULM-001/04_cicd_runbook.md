# PULM-001 — CI/CD + Helpdesk

## Helpdesk
- L1: login, slow, can't see patient
- L2: PFT entry, O2 order, procedure
- L3: RLS, PHI leak, performance

## Runbook
- **Tension PTX:** Needle decompression (2nd ICS, midclav)
- **Massive PE:** Thrombolysis
- **Status asthmaticus:** IV Mag, ICU
- **ARDS:** Lung protective vent
- **Massive hemoptysis:** IR

## CI/CD
```yaml
name: PULM-001 Deploy
on:
  push: [main, integration/pulm]
jobs:
  test: { runs-on: ubuntu-latest, steps: [actions/checkout@v4, npm ci, npm test -- pulm] }
  deploy-staging: { needs: test, steps: [deploy_staging.sh pulm] }
  deploy-prod: { needs: deploy-staging, environment: production, steps: [backup_db.sh, deploy_prod.sh pulm] }
```

## Health
```bash
curl https://jumanasoft.com/api/pulm/health
```
