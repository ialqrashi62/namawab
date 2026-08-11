---
name: nm-deployment-cicd
description: Use when deploying to Hetzner live, running migrations on production, or rolling back a deploy. Loads the canonical 9-step deploy pipeline with safety rails. Saves ~75% tokens per deploy.
---

# Deployment & CI/CD — Hetzner Live

## When to use

Anytime you need to:
- Push new code to `nama-medical-erp` PM2 process
- Apply migrations to live DB
- Reload Express server
- Roll back a deploy
- Run a CI/CD pipeline

## 9-step pipeline

```
1. pre-flight  → check git status, confirm branch
2. build       → npm install, lint
3. test        → npm test, coverage report
4. snapshot    → backup schema + DB dump
5. sync        → rsync/scp source to Hetzner
6. migrate     → apply migrations to live
7. restart     → pm2 reload nama-medical-erp
8. verify      → curl /api/health, /api/<dept>/health
9. close       → log to CHANGELOG + create deploy report
```

## Step 1 — Pre-flight

```bash
cd c:\Users\ice\Desktop\NMEDCALVSCODE
git status
git rev-parse --abbrev-ref HEAD   # must be ops/jumanasoft-enterprise-facility-platform-staging-prep
git diff --stat HEAD~1
```

## Step 2 — Build

```bash
cd namaweb
npm install --production
npm run lint
```

## Step 3 — Test

```bash
cd namaweb
npm test
# Coverage report must be ≥ 80% for new files
```

## Step 4 — Snapshot

```bash
ssh root@204.168.144.74 "pg_dump --schema-only --no-owner nama_medical_web \
  | gzip > /var/backups/schema.before-deploy.$(date +%Y%m%d_%H%M%S).sql.gz"
ssh root@204.168.144.74 "pg_dump --data-only --no-owner nama_medical_web \
  | gzip > /var/backups/data.before-deploy.$(date +%Y%m%d_%H%M%S).sql.gz"
ssh root@204.168.144.74 "cp /var/www/namaweb/server.js /var/backups/server.js.before-deploy.$(date +%Y%m%d_%H%M%S)"
```

## Step 5 — Sync

```bash
# Sync new files (do NOT delete any files on the server)
ssh root@204.168.144.74 "mkdir -p /var/www/namaweb/new-staging"
scp -r namaweb/migrations/eNN_*.sql root@204.168.144.74:/var/www/namaweb/new-staging/
scp namaweb/{dept}_engine.js namaweb/{dept}_router.js \
  root@204.168.144.74:/var/www/namaweb/new-staging/
```

## Step 6 — Migrate

```bash
ssh root@204.168.144.74 "cd /var/www/namaweb && \
  psql 'postgresql://nama_medical_app:NamaMedicalApp@2026!@localhost:5432/nama_medical_web?sslmode=disable' \
  -f new-staging/eNN_xxx_up.sql"
```

## Step 7 — Restart

```bash
ssh root@204.168.144.74 "cd /var/www/namaweb && \
  cp new-staging/{dept}_engine.js . && \
  cp new-staging/{dept}_router.js . && \
  pm2 reload nama-medical-erp"
```

## Step 8 — Verify

```bash
ssh root@204.168.144.74 "sleep 5 && curl -sS http://localhost:3000/api/health"
ssh root@204.168.144.74 "curl -sS http://localhost:3000/api/{dept}/health"
ssh root@204.168.144.74 "curl -sS -X POST http://localhost:3000/api/{dept}/{action} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer ${TOKEN}' \
  -d '{\"patient_id\":1,\"age\":65}'"
```

## Step 9 — Close

```bash
ssh root@204.168.144.74 "rm -rf /var/www/namaweb/new-staging"
cd c:\Users\ice\Desktop\NMEDCALVSCODE
git add -A
git commit -m "deploy: {dept} ({what changed})"
git push origin ops/jumanasoft-enterprise-facility-platform-staging-prep
```

Append to `docs/CHANGELOG.md` under `[Unreleased] → Deployed`:
```
- {dept} engine + router deployed to live
- migration eNN applied to live DB
- PM2 reload successful, smoke tests green
```

## Rollback

```bash
ssh root@204.168.144.74 "pm2 stop nama-medical-erp"
ssh root@204.168.144.74 "cp /var/backups/server.js.before-deploy.LATEST /var/www/namaweb/server.js"
ssh root@204.168.144.74 "gunzip -c /var/backups/data.before-deploy.LATEST.sql.gz | psql ... -f -"
ssh root@204.168.144.74 "pm2 start nama-medical-erp"
```

## CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: deploy
on:
  push:
    branches: [ops/jumanasoft-enterprise-facility-platform-staging-prep]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd namaweb && npm ci && npm test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: 204.168.144.74
          username: root
          key: ${{ secrets.HETZNER_SSH_KEY }}
          script: |
            cd /var/www/namaweb
            git pull origin ops/jumanasoft-enterprise-facility-platform-staging-prep
            npm install --production
            pm2 reload nama-medical-erp
            sleep 5
            curl -fsS http://localhost:3000/api/health
```

## Token saving

Manual deploy runbook = ~400 lines custom. With template = ~50 lines unique
per dept + 9-step shared. ~75% reduction.