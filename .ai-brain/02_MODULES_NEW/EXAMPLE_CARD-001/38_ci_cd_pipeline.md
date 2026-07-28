# 38 — CI/CD Pipeline (CARD-001)

> Owner: DSL · Tier 2

## Stages

```yaml
stages:
  - lint
  - unit_test
  - integration_test
  - e2e_test
  - security_scan
  - build
  - deploy_staging
  - smoke_test_staging
  - owner_approval
  - deploy_production
  - smoke_test_production
  - monitor_24h
```

## Stage 1: Lint

```yaml
- name: Lint
  runner: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: 20 }
    - run: npm ci
    - run: npx eslint namaweb --ext .js
    - run: npx prettier --check namaweb
```

## Stage 2: Unit tests

```yaml
- name: Unit Tests
  runner: ubuntu-latest
  services:
    postgres:
      image: postgres:16
      env: { POSTGRES_USER: test, POSTGRES_PASSWORD: test, POSTGRES_DB: nama_test }
  steps:
    - uses: actions/checkout@v4
    - run: npm ci
    - run: node --test namaweb/cardiology_engine_test.js
    - run: node --test namaweb/cds_test.js
    - run: node --test namaweb/ews_engine_test.js
    - run: node --test namaweb/specialty_scores_test.js
    - uses: actions/upload-artifact@v4
      with: { name: coverage, path: coverage/ }
```

## Stage 3: Integration tests

```yaml
- name: Integration Tests
  runner: ubuntu-latest
  services:
    postgres: { image: postgres:16, env: { POSTGRES_USER: test, POSTGRES_PASSWORD: test, POSTGRES_DB: nama_test } }
    redis: { image: redis:7 }
  steps:
    - run: npm ci
    - run: cd namaweb && node e2e_local_smoke_test.js
    - run: cd namaweb && node cross_tenant_leak_test.js
    - run: cd namaweb && node cross_tenant_dashboard_test.js
    - run: cd namaweb && node clinical_safety_f1_test.js
    - run: cd namaweb && node billing_integration_test.js
```

## Stage 4: E2E tests (Playwright)

```yaml
- name: E2E Tests
  runner: ubuntu-latest
  steps:
    - run: npm ci
    - run: npx playwright install --with-deps
    - run: npx playwright test e2e/cardiology/
    - uses: actions/upload-artifact@v4
      with: { name: playwright-report, path: playwright-report/ }
```

## Stage 5: Security scan

```yaml
- name: Security Scan
  runner: ubuntu-latest
  steps:
    - run: npm audit --audit-level=high
    - run: npx snyk test
    - uses: github/codeql-action/analyze@v3
    - run: npx owasp-zap-baseline.py -t https://staging.jumanasoft.com
    - run: npx gitleaks detect --no-banner
```

## Stage 6: Build

```yaml
- name: Build
  runner: ubuntu-latest
  steps:
    - run: npm ci
    - run: npm run build:css
    - uses: actions/upload-artifact@v4
      with: { name: build, path: namaweb/ }
```

## Stage 7: Deploy staging (auto on main)

```yaml
- name: Deploy Staging
  needs: [lint, unit_test, integration_test, e2e_test, security_scan, build]
  if: github.ref == 'refs/heads/integration/all-epics'
  runner: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Deploy via SSH
      run: |
        rsync -avz --delete namaweb/ nama-medical@204.168.144.74:/opt/nama-medical/namaweb/
        ssh nama-medical@204.168.144.74 "cd /opt/nama-medical/namaweb && npm ci --production"
        ssh nama-medical@204.168.144.74 "cd /opt/nama-medical/namaweb && PGPASSWORD=$PGPASSWORD psql -U nama_medical_app -d nama_medical_web -f migrations/<e50_cardio_v1>_up.sql"
        ssh nama-medical@204.168.144.74 "pm2 reload nama-medical-erp"
```

## Stage 8: Smoke test staging

```yaml
- name: Smoke Staging
  needs: deploy_staging
  runner: ubuntu-latest
  steps:
    - run: ./scripts/smoke_test.sh https://staging.jumanasoft.com
    - if: failure()
      run: |
        ssh nama-medical@204.168.144.74 "cd /opt/nama-medical/namaweb && PGPASSWORD=$PGPASSWORD psql -U nama_medical_app -d nama_medical_web -f migrations/<e50_cardio_v1>_down.sql"
        ssh nama-medical@204.168.144.74 "pm2 reload nama-medical-erp"
```

## Stage 9: Owner approval (manual gate)

```yaml
- name: Owner Approval
  needs: smoke_test_staging
  if: github.ref == 'refs/heads/main'
  environment: production-approval
  steps:
    - run: echo "Awaiting owner approval via GitHub Environment"
```

## Stage 10: Deploy production (manual trigger)

```yaml
- name: Deploy Production
  needs: owner_approval
  if: github.event.deployment.statuses.state == 'success'
  runner: ubuntu-latest
  steps:
    - run: ./scripts/deploy_prod.sh
```

## Stage 11: Smoke production

```yaml
- name: Smoke Production
  needs: deploy_production
  runner: ubuntu-latest
  steps:
    - run: ./scripts/smoke_test.sh https://jumanasoft.com
```

## Stage 12: Monitor 24h

```yaml
- name: Monitor 24h
  needs: smoke_production
  if: success()
  steps:
    - run: ./scripts/alert_owner.sh "Cardiology deploy complete. Monitor for 24h."
    - run: ./scripts/cron_post_deploy_monitor.sh
```

## Branch strategy

- `main` — production (deploy only via PR + owner approval)
- `integration/all-epics` — staging (auto-deploy)
- `audit/*` — read-only snapshot (independent security review)
- `feature/*` — short-lived feature branches

## Required checks (gate)

- [ ] Lint passes
- [ ] All unit tests pass (>80% coverage)
- [ ] All integration tests pass (cross-tenant, clinical_safety, billing, e2e)
- [ ] No Critical/High security findings
- [ ] No new hardcoded secrets
- [ ] Migrations forward + backward
- [ ] No RLS regression
- [ ] Owner-approved for production
