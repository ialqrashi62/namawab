#!/bin/bash

# ==============================================================================
# SCRIPT: backup_and_prep.sh
# PURPOSE: Zero-Risk Backup for jumanasoft.com
# AUTHOR: Chief DevOps Architect (S-MODE)
# ==============================================================================

set -e # Exit on any error

# --- Configuration ---
BACKUP_DIR="/home/ubuntu/backups/$(date +%Y%m%d_%H%M%S)"
WEB_ROOT="/var/www/jumanasoft"
DB_NAME="namamedical_prod"
DB_USER="postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting Zero-Risk Backup Process..."

# 1. Create Backup Directory
mkdir -p "$BACKUP_DIR"

# 2. Backup Web Files
echo "📦 Backing up web root files..."
tar -czf "$BACKUP_DIR/web_files_backup_$TIMESTAMP.tar.gz" -C "$WEB_ROOT" .

# 3. Backup Database
echo "🗄️ Backing up PostgreSQL database..."
pg_dump -U "$DB_USER" -F c "$DB_NAME" > "$BACKUP_DIR/db_backup_$TIMESTAMP.dump"

# 4. Integrity Check
echo "🔍 Verifying backup integrity..."
if [ -f "$BACKUP_DIR/web_files_backup_$TIMESTAMP.tar.gz" ] && [ -s "$BACKUP_DIR/db_backup_$TIMESTAMP.dump" ]; then
    echo "✅ Backup verified successfully. Files exist and are non-empty."
else
    echo "❌ CRITICAL ERROR: Backup verification failed. Aborting process."
    exit 1
fi

echo "🎉 Backup completed successfully. Location: $BACKUP_DIR"
echo "⚠️  S-MODE Warning: Do not proceed with deployment until this backup is verified manually."
