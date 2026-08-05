#!/bin/bash
# Audit PWA manifest, head, and favicon
echo "=== ls manifest.json + favicon ==="
ls -la /var/www/namaweb/public/manifest.json /var/www/namaweb/public/favicon.ico 2>&1
echo ""
echo "=== CURRENT manifest.json ==="
cat /var/www/namaweb/public/manifest.json
echo ""
echo "=== CURRENT index.html <head> first 50 lines ==="
sed -n '1,50p' /var/www/namaweb/public/index.html
echo ""
echo "=== Any existing apple-touch-icon / favicon links in index.html ==="
grep -niE "apple-touch-icon|rel=.icon|favicon" /var/www/namaweb/public/index.html
echo ""
echo "=== img directory contents ==="
ls -la /var/www/namaweb/public/img/ | head -20
