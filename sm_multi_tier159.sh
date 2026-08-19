#!/usr/bin/env bash
# filepath: sm_multi_tier159.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "hs-bed"     "eng/tier159-hos-747/bed"             /tmp/multi_body_0.json
chk "hs-stf"     "eng/tier159-hos-747/staffing"        /tmp/multi_body_1.json
chk "hs-inc"     "eng/tier159-hos-747/incident"        /tmp/multi_body_2.json
chk "hs-qme"     "eng/tier159-hos-747/quality_metric"  /tmp/multi_body_3.json
chk "hs-rmg"     "eng/tier159-hos-747/risk_mgmt"       /tmp/multi_body_4.json
chk "cm-hip"     "eng/tier159-cmp-748/hipaa"           /tmp/multi_body_5.json
chk "cm-aud"     "eng/tier159-cmp-748/audit"           /tmp/multi_body_6.json
chk "cm-acr"     "eng/tier159-cmp-748/accreditation"   /tmp/multi_body_7.json
chk "cm-trg"     "eng/tier159-cmp-748/training"        /tmp/multi_body_8.json
chk "cm-lic"     "eng/tier159-cmp-748/license"         /tmp/multi_body_9.json
chk "in-ivn"     "eng/tier159-inv-749/inventory"       /tmp/multi_body_10.json
chk "in-po"      "eng/tier159-inv-749/purchase_order"  /tmp/multi_body_11.json
chk "in-plv"     "eng/tier159-inv-749/par_level"       /tmp/multi_body_12.json
chk "in-rcl"     "eng/tier159-inv-749/recall"          /tmp/multi_body_13.json
chk "in-eqp"     "eng/tier159-inv-749/equipment"       /tmp/multi_body_14.json
chk "fn-bil"     "eng/tier159-fin-750/billing"         /tmp/multi_body_15.json
chk "fn-icm"     "eng/tier159-fin-750/insurance_claim" /tmp/multi_body_16.json
chk "fn-dny"     "eng/tier159-fin-750/denial"          /tmp/multi_body_17.json
chk "fn-arf"     "eng/tier159-fin-750/ar_followup"     /tmp/multi_body_18.json
chk "fn-rve"     "eng/tier159-fin-750/revenue"         /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"