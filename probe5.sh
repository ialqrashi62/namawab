#!/bin/bash
# Inspect ERP catalog JSON
curl -s http://127.0.0.1:3000/pcc-catalog/modules > /tmp/cat_erp.json
echo "=== ERP /pcc-catalog/modules head ==="
head -c 300 /tmp/cat_erp.json
echo ""
echo "=== parse via node ==="
node -e 'const j=require("/tmp/cat_erp.json");console.log("top="+Object.keys(j).join(","));const a=j.modules||j;console.log("count="+a.length);console.log("first="+JSON.stringify(a[0]||{}));console.log("keys="+Object.keys(a[0]||{}).join(","));console.log("version_samples="+a.slice(0,3).map(m=>m.version).join("|"));'
echo ""
echo "=== 8 module routes on PCC (3101) ==="
for m in cardiology-ext102 endocrinology-ext102 anesthesiology-ext102 adolescent-ext101 emergency-ext102 billing pharmacy-ext102 icu-ext102; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3101/api/v1/pcc-$m/list")
  echo "$code  pcc-$m"
done
