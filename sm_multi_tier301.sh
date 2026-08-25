#!/bin/bash
pass=0; fail=0
chk() { local n=$1; local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/"); local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json); if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi; }
chk tier301_u5_1446_t301_e1_record
chk tier301_u5_1446_t301_e2_fetch
chk tier301_u5_1446_t301_e3_update
chk tier301_u5_1446_t301_e4_delete
chk tier301_u5_1446_t301_e5_list
echo "TOTALS: pass=$pass fail=$fail"
