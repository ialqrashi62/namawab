#!/bin/bash
echo "=== PCC /pcc-catalog/modules on 3101 ==="
curl -s http://127.0.0.1:3101/pcc-catalog/modules > /tmp/cat_pcc.json
node -e "const j=require('/tmp/cat_pcc.json');console.log('top_keys='+Object.keys(j).join(','));const arr=j.modules||j;console.log('count='+arr.length);console.log('first='+JSON.stringify(arr[0]||{}).slice(0,200));console.log('module_keys='+Object.keys(arr[0]||{}).join(','))"
echo ""
echo "=== ERP /pcc-catalog/modules on 3000 ==="
curl -s -o /tmp/cat_erp.json -w "http=%{http_code}\n" http://127.0.0.1:3000/pcc-catalog/modules
node -e "try{const j=require('/tmp/cat_erp.json');console.log('top_keys='+Object.keys(j).join(','));const arr=j.modules||j;console.log('count='+arr.length);console.log('first='+JSON.stringify(arr[0]||{}).slice(0,200))}catch(e){console.log('NOT_JSON_or_error='+e.message)}"
echo ""
echo "=== endocrinology lifecycle ==="
curl -s "http://127.0.0.1:3101/api/v1/pcc-endocrinology-ext102/list" > /tmp/list.json
node -e "const j=require('/tmp/list.json');console.log('list_keys='+Object.keys(j).join(','));console.log('first_fn='+(j.functions||[])[0])"
FN=$(node -e "const j=require('/tmp/list.json');process.stdout.write((j.functions||[])[0]||'')")
echo "calling $FN"
curl -s -X POST -H "Content-Type: application/json" -d "{}" "http://127.0.0.1:3101/api/v1/pcc-endocrinology-ext102/call/$FN" > /tmp/call.json
node -e "const j=require('/tmp/call.json');console.log('call_keys='+Object.keys(j).join(','));console.log('call='+JSON.stringify(j).slice(0,300))"
