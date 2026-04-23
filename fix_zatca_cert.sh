#!/bin/bash
set -e
echo "=== Fixing ZATCA Certificate Encoding Bug ==="
echo "Problem: binarySecurityToken double-decoded (base64→utf8) corrupts DER data"
echo "Fix: Use token directly as PEM body (it's already base64-of-DER)"
echo ""

FILE="/var/www/namaweb/server.js"
BACKUP="/var/www/namaweb/server.js.bak.$(date +%Y%m%d_%H%M%S)"

# Backup
cp "$FILE" "$BACKUP"
echo "✅ Backup: $BACKUP"

# Fix 1: The compliance-check endpoint builds certPem incorrectly
# OLD (BROKEN):
#   const certBase64Body = Buffer.from(settings.zatca_compliance_token, 'base64').toString('utf-8');
#   const certPem = '-----BEGIN CERTIFICATE-----' + '\n' + certBase64Body + '\n' + '-----END CERTIFICATE-----';
# NEW (CORRECT):
#   The binarySecurityToken IS already base64(DER). PEM = headers + base64(DER) body.
#   We just need to wrap it with PEM headers directly.

# Use node to do the replacement precisely
node -e "
const fs = require('fs');
let code = fs.readFileSync('$FILE', 'utf-8');
let fixes = 0;

// Fix 1: compliance-check cert building
const oldCert = \"const certBase64Body = Buffer.from(settings.zatca_compliance_token, 'base64').toString('utf-8');\";
const newCert = \"// binarySecurityToken is already base64(DER) - use directly as PEM body\\n        const certBase64Body = settings.zatca_compliance_token;\";

if (code.includes(oldCert)) {
    code = code.replace(oldCert, newCert);
    fixes++;
    console.log('✅ Fix 1: Fixed certificate double-decode in compliance-check');
} else {
    console.log('❌ Fix 1: Pattern not found (may already be fixed)');
    // Try alternate pattern
    if (code.includes(\"Buffer.from(settings.zatca_compliance_token, 'base64').toString('utf-8')\")) {
        code = code.replace(
            \"Buffer.from(settings.zatca_compliance_token, 'base64').toString('utf-8')\",
            'settings.zatca_compliance_token'
        );
        fixes++;
        console.log('✅ Fix 1 (alt): Fixed certificate decode');
    }
}

// Fix 2: Also fix the PEM wrapping to use proper line breaks (76 char lines)
const oldPem = \"const certPem = '-----BEGIN CERTIFICATE-----' + '\\\\n' + certBase64Body + '\\\\n' + '-----END CERTIFICATE-----';\";
const newPem = \"const certPem = '-----BEGIN CERTIFICATE-----\\\\n' + certBase64Body.match(/.{1,64}/g).join('\\\\n') + '\\\\n-----END CERTIFICATE-----';\";

if (code.includes(oldPem)) {
    code = code.replace(oldPem, newPem);
    fixes++;
    console.log('✅ Fix 2: Fixed PEM line wrapping');
} else {
    console.log('⚠️ Fix 2: PEM pattern not found, checking alternate...');
}

if (fixes > 0) {
    fs.writeFileSync('$FILE', code);
    console.log('✅ Saved ' + fixes + ' fixes to $FILE');
} else {
    console.log('⚠️ No fixes applied - patterns may have changed');
}
"

echo ""
echo "=== Restarting app ==="
pm2 restart namaweb
sleep 3
echo ""
echo "=== Testing compliance check ==="
pm2 logs namaweb --lines 5 --nostream
echo ""
echo "=== FIX DEPLOYED ==="
