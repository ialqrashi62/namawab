#!/bin/bash
set -e
cd /var/www/namaweb/public/js

echo "=== Fixing renderZATCA bug ==="
# Add 'const content = el;' after 'async function renderZATCA(el) {'
sed -i '/^async function renderZATCA(el) {$/,/^}$/{
  /^async function renderZATCA(el) {$/ a\  const content = el;
}' app.js

# Verify fix
echo "--- renderZATCA fix check ---"
sed -n '/async function renderZATCA/,+3p' app.js

echo ""
echo "=== Restarting app ==="
pm2 restart namaweb
sleep 3
pm2 list
echo "=== DONE ==="
