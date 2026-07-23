# NEPH-001 — JCI + ISO + Legal + CI/CD

## JCI
- Dialysis standards
- Water quality
- Access care
- Anemia management
- Mineral bone disease

## ISO 9001
- SOPs: HD, PD, transplant, AKI
- KPIs: Kt/V, hemoglobin, graft survival
- Audits: quarterly

## Legal Consent
1. Hemodialysis
2. Peritoneal dialysis
3. Living kidney donor
4. Deceased donor transplant
5. CRRT (ICU)
6. Plasmapheresis
7. Immunosuppression
8. Kidney biopsy
9. Fistula/graft
10. Tunneled catheter

## CI/CD
```yaml
name: NEPH-001 Deploy
on: [main, integration/neph]
jobs:
  test: { runs-on: ubuntu-latest, steps: [actions/checkout@v4, npm ci, npm test -- neph] }
  deploy-staging: { needs: test, steps: [deploy_staging.sh neph] }
  deploy-prod: { needs: deploy-staging, environment: production }
```
