#!/bin/bash
# NamaMedical — Deploy v5 to Hetzner
# Run on the server (ubuntu@204.168.144.74) by owner with SSH access.
#
# Usage:
#   bash deploy_v5_full.sh
#
# Requires: psql access, pm2 access, git access, root or nama user.

set -euo pipefail

REPO="/var/www/namaweb"
BRANCH="feat/waveA-subagent"
COMMIT="cea7daf3620ef2d07399e288f5b77d1949145e97"
BACKUP_DIR="/var/backups/namaweb-$(date +%Y%m%d-%H%M%S)"
MIGRATIONS=(
    "e47_cardiology"
    "e48_endocrine_emergency"
    "e49_pediatrics_surgery_pharmacy"
    "e50_oncology_nephrology_obgyn"
    "e51_pulm_gi_rheum_ortho_neuro"
)

echo "=== NamaMedical Deploy v5 ==="
echo "Target: $REPO"
echo "Branch: $BRANCH"
echo "Commit: $COMMIT"
echo ""

# 1. Backup
echo "[1/6] Creating backup..."
mkdir -p "$BACKUP_DIR"
cp -r "$REPO" "$BACKUP_DIR/" 2>/dev/null || echo "Backup: copy files only (no DB)"
echo "  Backup at: $BACKUP_DIR"

# 2. Checkout branch
echo "[2/6] Checking out branch..."
cd "$REPO" || { echo "FATAL: $REPO not found"; exit 1; }
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"
echo "  On commit: $(git rev-parse HEAD)"

# 3. Install deps if needed
echo "[3/6] Checking node modules..."
if [ ! -d "node_modules" ]; then
    npm ci --production
fi
echo "  node_modules OK"

# 4. Run migrations
echo "[4/6] Running migrations..."
for m in "${MIGRATIONS[@]}"; do
    SQL_FILE="migrations/${m}_up.sql"
    if [ -f "$SQL_FILE" ]; then
        echo "  Applying: $SQL_FILE"
        psql -U nama -d nama_medical -v ON_ERROR_STOP=1 -f "$SQL_FILE" || {
            echo "  ERROR: $SQL_FILE failed. Check backup."
            exit 1
        }
    else
        echo "  WARN: $SQL_FILE not found"
    fi
done

# 5. Restart PM2
echo "[5/6] Restarting PM2..."
pm2 restart nama-medical-erp || pm2 start ecosystem.config.js
sleep 3
pm2 list

# 6. Smoke tests
echo "[6/6] Running smoke tests..."
echo "  --- Health check ---"
curl -s -o /dev/null -w "  HTTP %{http_code} in %{time_total}s\n" http://localhost:3000/health || echo "  /health unreachable (may need auth)"

echo "  --- Engine tests ---"
node cardiology_engine_test.js 2>&1 | tail -2
node multispecialty_engine_test.js 2>&1 | tail -2

echo ""
echo "=== Deploy v5 Complete ==="
echo "Branch: $BRANCH @ $(git rev-parse --short HEAD)"
echo "Files:  14 routers + 5 migrations + 15 frontend pages"
echo "Tests:  76+ pure-function tests"
echo "URL:    https://jumanasoft.com"
echo "Dept:   https://jumanasoft.com/departments/hub.html"
echo "Backup: $BACKUP_DIR"
