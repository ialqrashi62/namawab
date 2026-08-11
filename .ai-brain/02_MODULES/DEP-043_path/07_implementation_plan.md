# Implementation Plan — Pathology (DEP-043)

> **DOL:** Ms. Rania Farouk · Generated 2026-08-08

## 1. Phases
| Phase | Duration | Tasks |
|---|---|---|
| 1. Design | 1 day | Schema + API + UI wireframes |
| 2. Backend | 2 days | Engine + Routes + Tests |
| 3. Frontend | 2 days | Station + Components + i18n |
| 4. RAG | 1 day | Ingest guidelines + Chains |
| 5. Integration | 1 day | Server wiring + E2E |
| 6. Deploy | 0.5 day | Sandbox → Staging → Prod |

## 2. CI/CD Pipeline
```yaml
name: path-ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- path_test.js
      - run: npm run lint
  deploy-staging:
    if: github.ref == 'refs/heads/integration/all-epics'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: ./scripts/deploy_staging.sh path
```

## 3. Rollback Plan
1. Tag current production: `git tag prod-path-<timestamp>`
2. Deploy new: `pm2 reload nama-medical-erp`
3. If fail: `pm2 reload nama-medical-erp --update-env && git revert`

## 4. Monitoring
- Prometheus: dept request rate, latency, error rate
- Grafana: dept dashboard
- PagerDuty: >5% error rate alerts