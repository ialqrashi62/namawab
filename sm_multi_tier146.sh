#!/usr/bin/env bash
# filepath: sm_multi_tier146.sh
BASE="http://127.0.0.1:3000/api"
PASS=0
FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then
    echo "OK $name ($code)"; PASS=$((PASS+1))
  else
    echo "FAIL $name ($code)"; FAIL=$((FAIL+1))
  fi
}
chk "ane-pre"      "eng/tier146-ane-693/preop"               /tmp/multi_body_0.json
chk "ane-ind"      "eng/tier146-ane-693/induction"           /tmp/multi_body_1.json
chk "ane-iot"      "eng/tier146-ane-693/intraop"             /tmp/multi_body_2.json
chk "ane-pai"      "eng/tier146-ane-693/pain"                /tmp/multi_body_3.json
chk "ane-emr"      "eng/tier146-ane-693/emergence"           /tmp/multi_body_4.json
chk "hem-cbc"      "eng/tier146-hem-694/cbc"                 /tmp/multi_body_5.json
chk "hem-coa"      "eng/tier146-hem-694/coagulation"         /tmp/multi_body_6.json
chk "hem-txn"      "eng/tier146-hem-694/transfusion"         /tmp/multi_body_7.json
chk "hem-chm"      "eng/tier146-hem-694/chemo"               /tmp/multi_body_8.json
chk "hem-bmr"      "eng/tier146-hem-694/marrow"              /tmp/multi_body_9.json
chk "neu-crn"      "eng/tier146-neu-695/craniotomy"          /tmp/multi_body_10.json
chk "neu-spn"      "eng/tier146-neu-695/spine_op"            /tmp/multi_body_11.json
chk "neu-vps"      "eng/tier146-neu-695/vp_shunt"            /tmp/multi_body_12.json
chk "neu-icm"      "eng/tier146-neu-695/intracranial_monitor" /tmp/multi_body_13.json
chk "neu-skb"      "eng/tier146-neu-695/skull_base"          /tmp/multi_body_14.json
chk "irr-biy"      "eng/tier146-irr-696/biopsy"              /tmp/multi_body_15.json
chk "irr-drn"      "eng/tier146-irr-696/drain"               /tmp/multi_body_16.json
chk "irr-ang"      "eng/tier146-irr-696/angio"               /tmp/multi_body_17.json
chk "irr-tce"      "eng/tier146-irr-696/tace"                /tmp/multi_body_18.json
chk "irr-rfq"      "eng/tier146-irr-696/radiofrequency"      /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"