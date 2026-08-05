# PCC Sandbox Deployment Runbook

> Owner-gated deployment of PCC v3.316.29 to jumanasoft.com (Hetzner ubuntu-8gb-hel1-1, 204.168.144.74).
> **READ THIS ENTIRELY BEFORE RUNNING DEPLOY.**

## Table of contents
1. [Prerequisites](#prerequisites)
2. [Dry-run workflow](#dry-run-workflow)
3. [Live deployment](#live-deployment)
4. [Post-deploy verification](#post-deploy-verification)
5. [Rollback procedure](#rollback-procedure)
6. [Common issues](#common-issues)

## Prerequisites

Before deploying, ensure you have:

- [ ] **SSH key** with deploy access to `204.168.144.74` (path: `~/.ssh/hetzner_deploy`)
- [ ] **Environment variables set**:
  - `DEPLOY_SSH_KEY=/path/to/private/key`
  - `DEPLOY_REMOTE=deploy@204.168.144.74`
  - `DEPLOY_BRANCH=integration/all-epics`
- [ ] **PostgreSQL access** for the migration step:
  - `PCC_DB_HOST=<db-host>`
  - `PCC_DB_USER=nama_pcc_app`
  - `PCC_DB_PASSWORD=<password>`
  - `PCC_DB_NAME=nama_medical`
- [ ] **Git working tree clean** — `git status` shows no uncommitted changes
- [ ] **Master runner passes locally** — `node scratch/master_runner_v3169.js` returns PASS

## Dry-run workflow

**ALWAYS run a dry-run first.** This shows what the deploy script would do without actually executing anything.

```bash
cd pcc
bash scripts/deploy_pcc_to_jumanasoft.sh --dry-run
```

Expected output:
- All phases print `[DRY-RUN]` prefixes
- No SSH connections attempted
- Final line: `DRY-RUN COMPLETE (no changes were made)`
- Exit code: 0

If dry-run prints any unexpected errors or warnings, **STOP** and investigate.

## Live deployment

Once dry-run passes, deploy with explicit confirmation:

```bash
bash scripts/deploy_pcc_to_jumanasoft.sh --confirm
```

The script will:
1. Verify SSH connectivity to deploy@204.168.144.74
2. Check current branch matches expected
3. Backup the current production state to `scratch/backup_<timestamp>/`
4. Pull latest code from the configured branch
5. Restart the PCC service via PM2 (`pm2 restart nama-medical-erp`)
6. Run health check against `https://jumanasoft.com/health`
7. Auto-revert on health check failure (within 60 seconds)

## Post-deploy verification

After deploy succeeds, run these checks from your local machine:

```bash
# 1. Health endpoints
curl -sS https://jumanasoft.com/health
curl -sS https://jumanasoft.com/readyz

# 2. Run local scripts against production
bash scripts/health_check.sh https://jumanasoft.com
bash scripts/smoke_test.sh https://jumanasoft.com

# 3. Check Prometheus metrics
curl -sS https://jumanasoft.com/_metrics | grep -E '^pcc_(http_requests_total|module_count|uptime_seconds)'

# 4. Apply PG migration + bootstrap token (first-time only)
bash scripts/bootstrap_token.sh https://jumanasoft.com
```

All checks should pass within 5 minutes. If any check fails, see [Rollback procedure](#rollback-procedure).

## Rollback procedure

The deploy script has an **auto-revert** mechanism — if the health check fails within 60s of restart, it automatically rolls back to the previous backup.

For manual rollback:
```bash
ssh deploy@204.168.144.74
cd /opt/nama-medical-erp
git checkout <previous-commit-sha>
pm2 restart nama-medical-erp
```

Find the previous commit SHA in `scratch/backup_<timestamp>/.git-ref` on the deploy host.

## Common issues

### `SSH failed` in dry-run
- Verify `DEPLOY_SSH_KEY` is set and points to a readable file
- Test SSH manually: `ssh -i $DEPLOY_SSH_KEY deploy@204.168.144.74 echo OK`

### `Health check failed` after deploy
- Check PM2 logs: `pm2 logs nama-medical-erp --lines 100`
- Verify env vars on the server: `pm2 env nama-medical-erp`
- If persistent, manual rollback (see above)

### `PG migration failed` during bootstrap
- Verify `PCC_DB_HOST` is reachable from your local machine
- Check role exists: `psql -h $PCC_DB_HOST -U $PCC_DB_USER -c '\du'`
- Migration files are idempotent — safe to re-run

### `master runner FAIL` locally before deploy
- **DO NOT DEPLOY.** Fix the failure first.
- Check `scratch/master_out_<date>.txt` for details
- Most common: tokens map non-empty from prior testing → restart server cleanly
