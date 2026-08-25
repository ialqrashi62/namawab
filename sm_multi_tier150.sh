#!/usr/bin/env bash
# filepath: sm_multi_tier150.sh
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
chk "neu-sk"      "eng/tier150-neu-709/stroke"             /tmp/multi_body_0.json
chk "neu-ep"      "eng/tier150-neu-709/epilepsy"           /tmp/multi_body_1.json
chk "neu-ms"      "eng/tier150-neu-709/ms"                 /tmp/multi_body_2.json
chk "neu-mvt"     "eng/tier150-neu-709/movement"           /tmp/multi_body_3.json
chk "neu-nrp"     "eng/tier150-neu-709/neuropathy"         /tmp/multi_body_4.json
chk "end-dma"     "eng/tier150-end-710/dm_assess"          /tmp/multi_body_5.json
chk "end-dmc"     "eng/tier150-end-710/dm_comp"            /tmp/multi_body_6.json
chk "end-thr"     "eng/tier150-end-710/thyroid"           /tmp/multi_body_7.json
chk "end-adr"     "eng/tier150-end-710/adrenal"            /tmp/multi_body_8.json
chk "end-bne"     "eng/tier150-end-710/bone"               /tmp/multi_body_9.json
chk "rhe-rar"     "eng/tier150-rhe-711/ra"                 /tmp/multi_body_10.json
chk "rhe-sle"     "eng/tier150-rhe-711/sle"                /tmp/multi_body_11.json
chk "rhe-vsc"     "eng/tier150-rhe-711/vasculitis"         /tmp/multi_body_12.json
chk "rhe-spo"     "eng/tier150-rhe-711/spondylo"           /tmp/multi_body_13.json
chk "rhe-gou"     "eng/tier150-rhe-711/gout"               /tmp/multi_body_14.json
chk "hem-ant"     "eng/tier150-hem-712/anticoag"           /tmp/multi_body_15.json
chk "hem-bln"     "eng/tier150-hem-712/anticoag_bleed"    /tmp/multi_body_16.json
chk "hem-tht"     "eng/tier150-hem-712/thrombosis"         /tmp/multi_body_17.json
chk "hem-aph"     "eng/tier150-hem-712/apheresis"          /tmp/multi_body_18.json
chk "hem-hmd"     "eng/tier150-hem-712/hematology_dx"      /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"