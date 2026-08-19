#!/usr/bin/env bash
# filepath: sm_multi_tier151.sh
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
chk "pls-cns"     "eng/tier151-pls-713/consult"     /tmp/multi_body_0.json
chk "pls-rcn"     "eng/tier151-pls-713/recon"       /tmp/multi_body_1.json
chk "pls-hnd"     "eng/tier151-pls-713/hand_surg"    /tmp/multi_body_2.json
chk "pls-lsr"     "eng/tier151-pls-713/laser"       /tmp/multi_body_3.json
chk "pls-cmo"     "eng/tier151-pls-713/cmo"         /tmp/multi_body_4.json
chk "wou-waa"     "eng/tier151-wou-714/wound_assess" /tmp/multi_body_5.json
chk "wou-drs"     "eng/tier151-wou-714/dressing"    /tmp/multi_body_6.json
chk "wou-dbm"     "eng/tier151-wou-714/debridement" /tmp/multi_body_7.json
chk "wou-hpg"     "eng/tier151-wou-714/healing_progress" /tmp/multi_body_8.json
chk "wou-wbi"     "eng/tier151-wou-714/wound_bio"   /tmp/multi_body_9.json
chk "pod-asmt"    "eng/tier151-pod-715/assess"      /tmp/multi_body_10.json
chk "pod-ncr"     "eng/tier151-pod-715/nail_care"   /tmp/multi_body_11.json
chk "pod-ort"     "eng/tier151-pod-715/orthotic"    /tmp/multi_body_12.json
chk "pod-dft"     "eng/tier151-pod-715/diabetic_foot" /tmp/multi_body_13.json
chk "pod-bme"     "eng/tier151-pod-715/biomech"     /tmp/multi_body_14.json
chk "sle-psg"     "eng/tier151-sle-716/polysom"     /tmp/multi_body_15.json
chk "sle-ptt"     "eng/tier151-sle-716/pap_titration" /tmp/multi_body_16.json
chk "sle-msl"     "eng/tier151-sle-716/mslt"        /tmp/multi_body_17.json
chk "sle-icb"     "eng/tier151-sle-716/insomnia_cbt" /tmp/multi_body_18.json
chk "sle-prs"     "eng/tier151-sle-716/parasomnia"  /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"