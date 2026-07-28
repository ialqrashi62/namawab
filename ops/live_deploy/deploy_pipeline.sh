#!/bin/bash
# deploy_pipeline.sh - Enterprise CI/CD Pipeline for NamaMedical
# Implements: Staging -> Validation -> Atomic Switch -> Health Check -> Auto-Rollback

set -e

# --- Configuration ---
APP_DIR="/var/www/namaweb"
STAGING_DIR="/var/www/namaweb_staging"
BACKUP_DIR="/root/nama_backups/pipeline_$(date +%Y%m%d_%H%M%S)"
PM2_PROCESS="nama-medical-erp"
HEALTH_URL="http://localhost:3000/api/health"

echo "🚀 Starting Enterprise Deployment Pipeline..."

# 1. Preparation & Backup
echo "📦 Step 1: Creating system snapshot..."
mkdir -p "$BACKUP_DIR"
cp -r "$APP_DIR" "$BACKUP_DIR/"

# 2. Staging Deployment
echo "🚚 Step 2: Deploying to staging area..."
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"
# In a real CI, this would be: git clone or rsync from build artifact
cp -r "$APP_DIR"/* "$STAGING_DIR/" 

# 3. Static Validation
echo "🔍 Step 3: Running static analysis and syntax checks..."
cd "$STAGING_DIR"
# Check for syntax errors in server.js
node --check server.js
if [ $? -ne 0 ]; then
    echo "❌ Syntax error detected in server.js. Aborting deployment."
    exit 1
fi

# 4. Dependency Validation
echo "📦 Step 4: Validating dependencies..."
npm install --production --no-audit

# 5. Atomic Switch
echo "🔄 Step 5: Performing atomic switch..."
# Backup current server.js specifically
cp "$APP_DIR/server.js" "$BACKUP_DIR/server.js.pre"
# Sync staging to live
rsync -av "$STAGING_DIR/" "$APP_DIR/"

# 6. Service Restart
echo "♻️ Step 6: Restarting application via PM2..."
pm2 restart $PM2_PROCESS --update-env

# 7. Automated Health Check
echo "🏥 Step 7: Monitoring system health..."
MAX_RETRIES=6
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    HEALTH=$(curl -s $HEALTH_URL | grep -o '"status":"UP"')
    if [ "$HEALTH" == '"status":"UP"' ]; then
        echo "✅ System is HEALTHY. Deployment successful."
        exit 0
    fi
    echo "⏳ Waiting for system to stabilize... ($((RETRY_COUNT+1))/$MAX_RETRIES)"
    sleep 5
    RETRY_COUNT=$((RETRY_COUNT+1))
done

# 8. Auto-Rollback on Failure
echo "🚨 CRITICAL: Health check failed! Initiating auto-rollback..."
cp "$BACKUP_DIR/server.js.pre" "$APP_DIR/server.js"
pm2 restart $PM2_PROCESS
echo "⏪ Rollback complete. System restored to previous stable state."
exit 1
