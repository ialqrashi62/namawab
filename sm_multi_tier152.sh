#!/usr/bin/env bash
# filepath: sm_multi_tier152.sh
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
chk "pdc-fec"     "eng/tier152-pdc-717/fetal_echocardiogram" /tmp/multi_body_0.json
chk "pdc-cdx"     "eng/tier152-pdc-717/congenital_dx"        /tmp/multi_body_1.json
chk "pdc-cath"    "eng/tier152-pdc-717/peds_cath"           /tmp/multi_body_2.json
chk "pdc-arr"     "eng/tier152-pdc-717/arrhythmia_peds"      /tmp/multi_body_3.json
chk "pdc-svt"     "eng/tier152-pdc-717/single_ventricle"     /tmp/multi_body_4.json
chk "pcs-nor"     "eng/tier152-pcs-718/norwood"             /tmp/multi_body_5.json
chk "pcs-gle"     "eng/tier152-pcs-718/glenn"               /tmp/multi_body_6.json
chk "pcs-fon"     "eng/tier152-pcs-718/fontan"              /tmp/multi_body_7.json
chk "pcs-ars"     "eng/tier152-pcs-718/arterial_switch"     /tmp/multi_body_8.json
chk "pcs-tor"     "eng/tier152-pcs-718/tetralogy_repair"    /tmp/multi_body_9.json
chk "pgu-wvt"     "eng/tier152-pgu-719/well_visit"          /tmp/multi_body_10.json
chk "pgu-dvp"     "eng/tier152-pgu-719/developmental"       /tmp/multi_body_11.json
chk "pgu-imz"     "eng/tier152-pgu-719/immunizations"       /tmp/multi_body_12.json
chk "pgu-nbo"     "eng/tier152-pgu-719/new_born"            /tmp/multi_body_13.json
chk "pgu-ads"     "eng/tier152-pgu-719/adolescent"          /tmp/multi_body_14.json
chk "chi-cfo"     "eng/tier152-chi-720/chd_followup"        /tmp/multi_body_15.json
chk "chi-acd"     "eng/tier152-chi-720/adult_chd"           /tmp/multi_body_16.json
chk "chi-trn"     "eng/tier152-chi-720/transition"          /tmp/multi_body_17.json
chk "chi-lto"     "eng/tier152-chi-720/long_term_outcome"   /tmp/multi_body_18.json
chk "chi-cpx"     "eng/tier152-chi-720/cardiopulmonary_exercise" /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"