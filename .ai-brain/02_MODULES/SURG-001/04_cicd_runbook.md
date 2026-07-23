# SURG-001 — Helpdesk + CI/CD

## L1 Support
- Cannot log in
- OR schedule not visible
- Pre-op checklist not saving
- Intra-op form issues
- Complication grading

## L2 Support
- Database issues
- AI service
- RLS / tenant issues
- Antibiotic timing alert
- VTE scoring

## L3 Support
- Migration issues
- Performance
- PHI leak

## On-Call
- Surgeon
- OR scheduler
- IT
- Escalation: surgery director → CMO → CTO

## Runbook Templates
- **Antibiotic not given:** Verify with team, document reason
- **Counts discrepancy:** Re-count, image if needed
- **Wrong-site surgery:** STOP, verify, document
- **Intra-op complication:** Activate call system
- **Complication grading:** Use Clavien-Dindo

## Communication
- Slack: #surg-helpdesk
- Email: surg-support@jumanasoft.com
- Phone: ext 1234

## CI/CD

```yaml
name: SURG-001 Deploy
on:
  push:
    branches: [main, integration/surg]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- surg
  deploy-staging:
    needs: test
    steps:
      - run: ./deploy_staging.sh surg
  deploy-prod:
    needs: deploy-staging
    environment: production
    steps:
      - run: ./backup_db.sh
      - run: ./deploy_prod.sh surg
```

## Rollback
```bash
pm2 stop nama-medical-erp
psql -U nama_medical_app -d nama_medical -f migrations/e104_surg_general_down.sql
pm2 start nama-medical-erp
```

## Health
```bash
curl https://jumanasoft.com/api/surg/health
# { "ok": true, "scheduled": 12, "active": 3 }
```

## Post-Deploy Monitoring
- **Hour 1:** OR schedule OK
- **Hour 4:** Pre-op check compliance
- **Hour 24:** Complication rate
- **Day 7:** SSI rate, length of stay
