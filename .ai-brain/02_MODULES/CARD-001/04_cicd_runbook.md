# CARD-001 — Helpdesk + CI/CD

## L1 Support
- Login issues
- ECG not uploading
- Risk calculator wrong
- Med list missing
- Device not showing

## L2 Support
- Database issues
- AI service
- RLS / tenant
- Door-to-balloon tracking
- Cath lab integration

## L3 Support
- Migration
- Performance
- PHI leak

## On-Call
- Cardiologist
- Cath lab
- IT
- Escalation: cardiology director → CMO → CTO

## Runbook
- **STEMI alert not firing:** Check ECG pipeline
- **Door-to-balloon >90 min:** Review workflow
- **Anticoag error:** Check dose
- **Device not transmitting:** Check remote monitoring
- **PHI leak:** STOP service

## CI/CD
```yaml
name: CARD-001 Deploy
on:
  push:
    branches: [main, integration/card]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm ci
      - run: npm test -- card
  deploy-staging:
    needs: test
    steps:
      - run: ./deploy_staging.sh card
  deploy-prod:
    needs: deploy-staging
    environment: production
    steps:
      - run: ./backup_db.sh
      - run: ./deploy_prod.sh card
```

## Rollback
```bash
pm2 stop nama-medical-erp
psql -U nama_medical_app -d nama_medical -f migrations/e105_card_module_down.sql
pm2 start nama-medical-erp
```

## Health
```bash
curl https://jumanasoft.com/api/card/health
# { "ok": true, "encounters": 12, "active": 8 }
```

## Post-Deploy Monitoring
- **Hour 1:** STEMI detection
- **Hour 4:** Door-to-balloon
- **Hour 24:** Anticoag compliance
- **Day 7:** HF readmission, mortality
