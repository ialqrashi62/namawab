# PCC v3.316.16 Deployment Guide (jumanasoft.com)

> Owner-gated, audit-friendly deployment script for the live Hetzner server.
> See `AGENTS.md §2.4` — live-server commands require explicit owner authorization.

## 1. Prerequisites

Before running the script, set three environment variables on your **local** machine:

| Variable | Example | Purpose |
|---|---|---|
| `DEPLOY_SSH_KEY` | `~/.ssh/hetzner_deploy` | Path to SSH private key authorized on the Hetzner box |
| `DEPLOY_REMOTE` | `deploy@204.168.144.74` | SSH user@host of the live server |
| `DEPLOY_BRANCH` | `integration/all-epics` | Git branch to deploy (must match AGENTS.md) |

The remote PM2 app name is `nama-medical-erp` and the live health endpoint is `https://jumanasoft.com/health`.

## 2. Owner-Gate Rationale (AGENTS.md §2.4)

This script is **deliberately** stubborn. It will refuse to run unless you pass `--confirm` on the command line. Why?

- Live-server commands can cause patient-impacting downtime.
- A typo in an env var could deploy the wrong branch to production.
- An interrupted SSH session mid-deploy can leave PM2 in a bad state.

By requiring a *visible, intentional* `--confirm` flag, we ensure that:

1. The owner is consciously opting in (not running it from a forgotten cron job).
2. The terminal log shows explicit owner approval.
3. AGENTS.md §2.4 is honored: "no auto-deploy, requires explicit owner authorization."

If the script is run without `--confirm`, it prints a clear refusal message and exits with code 1. There is no `--force`, no `--yes`, no escape hatch. This is intentional.

## 3. Step-by-Step Deploy Procedure

```bash
# 1. Set environment variables (use a secrets manager, not the shell history)
export DEPLOY_SSH_KEY="$HOME/.ssh/hetzner_deploy"
export DEPLOY_REMOTE="deploy@204.168.144.74"
export DEPLOY_BRANCH="integration/all-epics"

# 2. Make the script executable (one-time)
chmod +x scripts/deploy_pcc_to_jumanasoft.sh

# 3. Run with explicit owner confirmation
./scripts/deploy_pcc_to_jumanasoft.sh --confirm
```

The script runs four phases:

1. **Pre-flight** — SSH connectivity, branch check, working-tree status, local master runner must PASS, remote PM2 app exists.
2. **Backup** — Creates a timestamped `tar.gz` snapshot on the remote under `~/backups/pre-deploy-YYYYMMDD-HHMMSS.tar.gz` (excludes `node_modules` and `.git`).
3. **Pull + restart** — `git fetch && git checkout && git pull`, then `npm install --production`, then `pm2 reload` (zero-downtime).
4. **Health check** — Polls `https://jumanasoft.com/health` and rolls back via `pm2 revert` if the response is not `"status":"ok"`.

## 4. Rollback Procedure

If the post-deploy health check fails, the script auto-rolls back. If you need to roll back manually:

**Option A — PM2 revert (fastest, recommended):**
```bash
ssh -i "$DEPLOY_SSH_KEY" "$DEPLOY_REMOTE" "pm2 revert nama-medical-erp"
```
PM2 keeps the last successful deploy in its snapshot store; `pm2 revert` swaps back instantly.

**Option B — Restore from backup tarball (slower, last resort):**
```bash
ssh -i "$DEPLOY_SSH_KEY" "$DEPLOY_REMOTE" <<'EOF'
  cd /home/deploy/jumana-medical-erp
  ls -lt backups/ | head -3                # pick the right tarball
  tar -xzf backups/pre-deploy-YYYYMMDD-HHMMSS.tar.gz
  pm2 reload nama-medical-erp --update-env
EOF
```

## 5. Pre-Flight Checklist

Before running, confirm all of the following — **do not skip any**:

- [ ] `node scratch/master_test_runner.js` is green locally.
- [ ] `git status` shows no uncommitted secrets or `.env` files.
- [ ] `DEPLOY_BRANCH` matches the branch you actually want deployed.
- [ ] SSH key is added to the remote `~/.ssh/authorized_keys` for the deploy user.
- [ ] Remote disk has at least 500 MB free under `/home/deploy/`.
- [ ] The owner has explicitly authorized this deploy in writing (chat, ticket, or signed commit).
- [ ] You are running the script interactively (not in CI, not from a webhook).

## 6. Rollback of the Script Itself

If this script is wrong, dangerous, or no longer needed, just delete both files:

```bash
rm scripts/deploy_pcc_to_jumanasoft.sh scripts/README_DEPLOY.md
```

No side effects, no state to clean up.
