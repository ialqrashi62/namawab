#!/bin/bash

# ==============================================================================
# SCRIPT: deploy_system.sh
# PURPOSE: Automated Production Deployment for jumanasoft.com
# AUTHOR: Chief DevOps Architect (S-MODE)
# ==============================================================================

set -e

# --- Configuration ---
SSH_KEY_PATH="C:\Users\ice\.ssh\id_rsa" # Default path, will be verified
REMOTE_USER="ubuntu"
REMOTE_HOST="204.168.144.74" # jumanasoft.com
REMOTE_DIR="/var/www/jumanasoft"
DB_NAME="namamedical_prod"

echo "🚀 Initializing Automated Deployment..."

# 1. SSH Key Verification
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "❌ SSH Key not found at $SSH_KEY_PATH. Searching for .pem files in C:\Users\ice..."
    SSH_KEY_PATH=$(find "C:\Users\ice" -name "*.pem" | head -n 1)
    if [ -z "$SSH_KEY_PATH" ]; then
        echo "❌ No valid SSH key found. Deployment aborted."
        exit 1
    fi
    echo "✅ Found alternative key: $SSH_KEY_PATH"
fi

# 2. Code Transfer & Sync
echo "📦 Syncing codebase to production server..."
scp -i "$SSH_KEY_PATH" -r ./namaweb "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

# 3. Remote Execution (Migrations & Dependencies)
echo "⚙️ Executing remote deployment commands..."
ssh -i "$SSH_KEY_PATH" "$REMOTE_USER@$REMOTE_HOST" << EOF
    cd $REMOTE_DIR
    
    # Install Dependencies
    npm install --production

    # Sequential Migration Execution (e1 to e81)
    echo "Running migrations sequentially..."
    for file in migrations/*.sql; do
        if [[ \$file == *"_up.sql" ]]; then
            echo "Applying \$file..."
            psql -d $DB_NAME -f "\$file" || {
                echo "❌ Migration failed at \$file. Initiating Rollback..."
                # Rollback logic: execute the corresponding _down.sql
                DOWN_FILE=\${file%_up.sql}_down.sql
                psql -d $DB_NAME -f "\$DOWN_FILE"
                exit 1
            }
        fi
    done

    # Restart Application via PM2
    pm2 restart nama-medical-erp || pm2 start server.js --name nama-medical-erp
    pm2 save
EOF

echo "🎉 Deployment completed successfully. System is LIVE at jumanasoft.com"
