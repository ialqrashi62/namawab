#!/usr/bin/env bash
# filepath: sm_multi_tier170.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "nr-vtl"     "eng/tier170-nrs-791/vitals"               /tmp/multi_body_0.json
chk "nr-hnd"     "eng/tier170-nrs-791/handoff"             /tmp/multi_body_1.json
chk "nr-wou"     "eng/tier170-nrs-791/wound_care"          /tmp/multi_body_2.json
chk "nr-ivt"     "eng/tier170-nrs-791/iv_therapy"          /tmp/multi_body_3.json
chk "nr-mgs"     "eng/tier170-nrs-791/med_safety"          /tmp/multi_body_4.json
chk "ra-xry"     "eng/tier170-rad-792/xray_read"           /tmp/multi_body_5.json
chk "ra-cts"     "eng/tier170-rad-792/ct_read"             /tmp/multi_body_6.json
chk "ra-mri"     "eng/tier170-rad-792/mri_read"            /tmp/multi_body_7.json
chk "ra-usg"     "eng/tier170-rad-792/ultrasound_read"     /tmp/multi_body_8.json
chk "ra-ipr"     "eng/tier170-rad-792/intervention"        /tmp/multi_body_9.json
chk "lb-hem"     "eng/tier170-lab-793/hematology"          /tmp/multi_body_10.json
chk "lb-chm"     "eng/tier170-lab-793/chemistry"           /tmp/multi_body_11.json
chk "lb-mic"     "eng/tier170-lab-793/microbiology"        /tmp/multi_body_12.json
chk "lb-trn"     "eng/tier170-lab-793/transfusion"         /tmp/multi_body_13.json
chk "lb-mol"     "eng/tier170-lab-793/molecular_lab"       /tmp/multi_body_14.json
chk "an-pre"     "eng/tier170-ane-794/preanesthesia"       /tmp/multi_body_15.json
chk "an-int"     "eng/tier170-ane-794/intraop"             /tmp/multi_body_16.json
chk "air-raw"    "eng/tier170-ane-794/airway"              /tmp/multi_body_17.json
chk "an-rgn"     "eng/tier170-ane-794/regional"            /tmp/multi_body_18.json
chk "an-pac"     "eng/tier170-ane-794/pacu"                /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"