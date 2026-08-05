#!/bin/bash
echo "=== /pcc-catalog/ on ERP (search input?) ==="
curl -s http://127.0.0.1:3000/pcc-catalog/ | grep -oE '<input[^>]*name="[^"]*"|<input[^>]*type="search"|placeholder="[^"]{1,80}"' | head -5
echo ""
echo "=== /api-docs/ (version element?) ==="
curl -s http://127.0.0.1:3000/api-docs/ | grep -oE 'version[^<]{0,80}|SwaggerUIBundle|swagger-ui' | head -5
echo ""
echo "=== /sw.js (cache name, install, fetch?) ==="
curl -s http://127.0.0.1:3000/sw.js | grep -nE 'CACHE_NAME|addEventListener|install|fetch' | head -10
echo ""
echo "=== /offline.html Arabic content? ==="
curl -s http://127.0.0.1:3000/offline.html | grep -oE '[\xd8-\xdb][\x80-\xbf][\xd8-\xdb][\x80-\xbf][\xd8-\xdb][\x80-\xbf]' | head -3
echo ""
echo "=== /openapi-pcc.yaml ==="
curl -s http://127.0.0.1:3000/openapi-pcc.yaml | grep -E '^openapi:|^info:|^paths:' | head -5
