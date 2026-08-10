# DEPLOYMENT + CI/CD PLAN
**Last updated:** 2026-08-10

---

## 1. Infrastructure

### Hetzner (production)

| Component | Spec | IP |
|---|---|---|
| Primary | CX31 (4 vCPU, 8GB RAM, 160GB SSD) | 204.168.144.74 |
| Backup | CX21 (2 vCPU, 4GB RAM, 80GB SSD) | (TBD) |
| DR (offsite) | Hetzner FSN1 | (TBD) |

### Cloudflare

- DNS
- DDoS protection
- WAF (OWASP rules)
- TLS termination

### Services running on primary

- Node.js app (PM2 process: `nama-medical-erp`)
- PostgreSQL 14+ (local)
- Redis (session store)
- Nginx (reverse proxy + TLS)
- PM2 (process manager)

---

## 2. CI/CD pipeline (GitHub Actions)

### Stages

```
PR opened
  ↓
L1: lint (eslint) — fail if errors
  ↓
L2: unit tests (npm test) — fail if any fails
  ↓
L3: integration tests (npm run test:integration) — fail if any fails
  ↓
L4: boundary validation (npm run test:clinical:safety + compliance + money) — fail if any fails
  ↓
L5: code coverage (≥ 80% required) — fail if below
  ↓
L6: security scan (npm audit + Snyk) — fail if critical/high
  ↓
Merge to integration/all-epics
  ↓
Deploy to staging (Hetzner staging env)
  ↓
Smoke tests (prod_smoke.sh)
  ↓
Manual QA signoff (owner + medical lead)
  ↓
Deploy to production (Hetzner primary)
  ↓
Smoke tests (prod_smoke.sh)
  ↓
Post-deploy monitoring (15min)
  ↓
Close
```

### Workflows (in `.github/workflows/`)

| Workflow | Trigger | Purpose |
|---|---|---|
| `lint.yml` | PR | ESLint check |
| `test.yml` | PR | Unit + integration tests |
| `security.yml` | PR | npm audit + Snyk |
| `boundary.yml` | PR | clinical:safety + compliance + money |
| `coverage.yml` | PR | Code coverage check |
| `staging-deploy.yml` | Merge to integration | Deploy to staging |
| `prod-deploy.yml` | Tag vX.Y.Z | Deploy to production |
| `backup.yml` | Daily 02:00 | DB backup to S3 |
| `healthcheck.yml` | Every 5min | Endpoint ping |
| `audit-chain.yml` | Daily 03:00 | Audit log integrity check |

---

## 3. Deployment

### 3.1 Local dev

```bash
cd namaweb
cp .env.example .env
npm install
node server.js  # http://localhost:3000
```

### 3.2 Staging

```bash
git checkout integration/all-epics
git pull
npm install
npm run migrate
pm2 restart nama-medical-erp-staging
./ops/smoke/staging_smoke.sh
```

### 3.3 Production

```bash
git checkout main
git pull
git tag vX.Y.Z
git push origin vX.Y.Z
ssh hetzner-prod "cd /srv/namaweb && git fetch && git checkout vX.Y.Z && npm install && npm run migrate && pm2 restart nama-medical-erp && sleep 5 && ./ops/smoke/prod_smoke.sh"
```

### 3.4 Rollback

```bash
ssh hetzner-prod "cd /srv/namaweb && git checkout vX.Y.Z-prev && pm2 restart nama-medical-erp"
```

Database migrations are non-destructive (no DROP), so rollback is safe.

---

## 4. Migrations

### Non-destructive policy

- Never DROP column · only add or modify
- Never DROP table · only rename
- Never lose data · always backup before
- Both `_up.sql` and `_down.sql` provided
- Migration runner tracks state in `schema_migrations` table

### Process

1. Write migration script (up + down)
2. Test on local DB
3. Test on staging
4. Run on production during low-traffic window (Friday 02:00)
5. Verify with smoke tests
6. Monitor for 24h

---

## 5. Backup + DR

### Backup schedule

- Full DB backup: daily 02:00
- Incremental: every 6h
- Retention: 30 daily · 12 monthly · 7 yearly
- Storage: Hetzner Storage Box + S3 (cross-region)

### DR plan

- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 1 hour
- DR site: Hetzner FSN1 (geographically separate)
- DR trigger: production outage > 30 min

### DR runbook

1. Confirm outage (multiple probes)
2. Notify stakeholders
3. Spin up DR site (Terraform)
4. Restore DB from latest backup
5. Point DNS to DR
6. Verify with smoke tests
7. Notify resolution

---

## 6. Environments

| Env | URL | Purpose |
|---|---|---|
| Local | localhost:3000 | Developer machine |
| CI | github actions | PR validation |
| Staging | staging.jumanasoft.com | Pre-prod QA |
| Production | jumanasoft.com | Live |

---

## 7. Secrets management

- `.env.example` (tracked) — placeholders only
- `.env` (gitignored) — actual secrets per env
- Secrets injected via PM2 ecosystem file
- ZATCA CSID, NPHIES client_id/secret, etc.
- No secrets in code or commits (safety rail #1)

---

## 8. Monitoring + alerts

See `APM_OBSERVABILITY_PLAN_AR.md` for full setup.

Critical alerts route to:
- PagerDuty (24/7 on-call)
- SMS (for Critical)
- Email (for High / Medium)
- Slack (informational)

---

End of deployment plan.
