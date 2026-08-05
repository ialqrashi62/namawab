#!/bin/bash
echo "=== PCC /api/v1/pcc-catalog/modules head ==="
curl -s http://127.0.0.1:3101/api/v1/pcc-catalog/modules > /tmp/cat_pcc.json
head -c 300 /tmp/cat_pcc.json
echo ""
node -e 'const j=require("/tmp/cat_pcc.json");console.log("top="+Object.keys(j).join(","));const a=j.modules||j;console.log("count="+a.length);console.log("first="+JSON.stringify(a[0]||{}));'
