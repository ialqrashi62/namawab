#!/bin/bash
# deploy_pcc_to_jumanasoft.sh — Owner-gated deployment of PCC v3.316.16
# to jumanasoft.com (Hetzner ubuntu-8gb-hel1-1, 204.168.144.74).
#
# USAGE:
#   ./deploy_pcc_to_jumanasoft.sh --confirm
#
# REQUIRED ENVIRONMENT VARIABLES (set before running):
#   DEPLOY_SSH_KEY   — path to SSH private key (e.g. ~/.ssh/hetzner_deploy)
#   DEPLOY_REMOTE    — user@host (e.g. deploy@204.168.144.74)
#   DEPLOY_BRANCH    — git branch to deploy (e.g. integration/all-epics)
#
# This script is OWNER-GATED: it will REFUSE to run without explicit --confirm
# flag, even if all env vars are set. Per AGENTS.md §2.4.

set -euo pipefail

REMOTE="${DEPLOY_REMOTE:-deploy@204.168.144.74}"
BRANCH="${DEPLOY_BRANCH:-integration/all-epics}"
SSH_KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/hetzner_deploy}"
APP_NAME="nama-medical-erp"
HEALTH_URL="https://jumanasoft.com/health"

# Owner gate (mutually exclusive: --confirm | --dry-run)
DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "=== DRY-RUN MODE (no actual SSH/deploy/restart) ==="
elif [[ "${1:-}" != "--confirm" ]]; then
  echo "ERROR: Owner authorization required. Run with --confirm flag." >&2
  echo "       Or run with --dry-run to preview the deployment without executing it." >&2
  echo "       (Per AGENTS.md §2.4: live-server commands require owner approval)" >&2
  exit 1
fi

# Helper that prints in dry-run mode, executes in real mode
run_step() {
  local description="$1"
  local command="$2"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[DRY-RUN] $description"
    echo "         would run: $command"
  else
    echo "$description"
    eval "$command"
  fi
}

if [[ "$DRY_RUN" != "true" ]]; then
  if [[ -z "$DEPLOY_SSH_KEY" ]]; then
    echo "ERROR: DEPLOY_SSH_KEY environment variable not set." >&2
    exit 1
  fi

  if [[ ! -f "$DEPLOY_SSH_KEY" ]]; then
    echo "ERROR: SSH key not found at $DEPLOY_SSH_KEY" >&2
    exit 1
  fi
else
  echo "  (DRY-RUN: skipping SSH key validation)"
fi

# SSH helper
ssh_cmd() {
  ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new -o BatchMode=yes "$REMOTE" "$1"
}

echo "============================================================"
echo " PCC v3.316.16 deploy to $REMOTE"
echo " Branch: $BRANCH"
echo " App:    $APP_NAME"
if [[ "$DRY_RUN" == "true" ]]; then
  echo " Mode:   DRY-RUN (no changes will be made)"
fi
echo "============================================================"

# Phase 1: pre-flight checks
echo
echo "=== Phase 1: Pre-flight ==="
echo "1.1 Verify SSH connectivity"
run_step "1.1 Verify SSH connectivity" "ssh_cmd \"echo 'SSH OK as '\$(whoami)\"" || { echo "SSH failed"; exit 1; }

echo "1.2 Verify current branch"
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DRY-RUN] 1.2 Verify current branch"
  echo "         would run: git rev-parse --abbrev-ref HEAD"
  LOCAL_BRANCH="(unknown in dry-run)"
else
  LOCAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  echo "  Local branch: $LOCAL_BRANCH"
  if [[ "$LOCAL_BRANCH" != "$BRANCH" ]]; then
    echo "  WARNING: local branch ($LOCAL_BRANCH) != target ($BRANCH)"
    echo "  Proceeding in 5 seconds \u2014 Ctrl+C to cancel..."
    sleep 5
  fi
fi

if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DRY-RUN] 1.3 Verify clean working tree (would run: git status --short | head -10)"
  echo "[DRY-RUN] 1.4 Run master runner locally (would run: node scratch/master_test_runner.js 2>&1 | tail -8)"
else
  echo "1.3 Verify clean working tree (or uncommitted is OK)"
  git status --short | head -10 || true

  echo "1.4 Run master runner locally (must be PASS)"
  node scratch/master_test_runner.js 2>&1 | tail -8
fi

echo "1.5 Verify remote app exists"
run_step "1.5 Verify remote app exists" "ssh_cmd \"pm2 list | grep -q '$APP_NAME' && echo '  App exists on remote' || echo '  WARNING: app not found on remote'\""

# Phase 2: backup
echo
echo "=== Phase 2: Remote backup ==="
run_step "Phase 2: Remote backup" "ssh_cmd \"mkdir -p backups && cd /home/deploy/jumana-medical-erp && tar -czf backups/pre-deploy-\$(date +%Y%m%d-%H%M%S).tar.gz --exclude=node_modules --exclude=.git .\""

# Phase 3: pull + restart
echo
echo "=== Phase 3: Pull + restart ==="
run_step "Phase 3a: git fetch + checkout + pull" "ssh_cmd \"cd /home/deploy/jumana-medical-erp && git fetch origin && git checkout $BRANCH && git pull origin $BRANCH\""
run_step "Phase 3b: npm install --production" "ssh_cmd \"cd /home/deploy/jumana-medical-erp && npm install --production --no-audit --no-fund\""
run_step "Phase 3c: pm2 reload $APP_NAME" "ssh_cmd \"pm2 reload $APP_NAME --update-env\""

# Phase 4: post-deploy health check
echo
echo "=== Phase 4: Post-deploy health check ==="
if [[ "$DRY_RUN" == "true" ]]; then
  run_step "Phase 4: post-deploy health check" "sleep 5 && curl -sS \"$HEALTH_URL\""
  echo "(DRY-RUN: skipping health-gate and rollback logic)"
else
  sleep 5
  HEALTH=$(curl -sS "$HEALTH_URL" 2>&1 || echo "FAIL")
  echo "Health response: $HEALTH"

  if echo "$HEALTH" | grep -q '"status":"ok"'; then
    echo "✓ HEALTH OK"
  else
    echo "✗ HEALTH FAILED — auto-rollback"
    run_step "Rollback: pm2 revert" "ssh_cmd \"pm2 revert $APP_NAME 2>&1 || pm2 restart $APP_NAME\""
    exit 1
  fi
fi

echo
echo "============================================================"
if [[ "$DRY_RUN" == "true" ]]; then
  echo "DRY-RUN COMPLETE (no changes were made)"
else
  echo "DEPLOY COMPLETE"
fi
echo "============================================================"
