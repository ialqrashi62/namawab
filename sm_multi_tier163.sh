#!/usr/bin/env bash
# filepath: sm_multi_tier163.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "ae-pmd"     "eng/tier163-aes-763/pilot_medical"         /tmp/multi_body_0.json
chk "ae-dcs"     "eng/tier163-aes-763/decompression_sick"    /tmp/multi_body_1.json
chk "ae-gst"     "eng/tier163-aes-763/gas_toxicity"          /tmp/multi_body_2.json
chk "ae-btr"     "eng/tier163-aes-763/barotrauma"            /tmp/multi_body_3.json
chk "ae-hyp"     "eng/tier163-aes-763/hypoxia_aviation"      /tmp/multi_body_4.json
chk "dv-dvt"     "eng/tier163-div-764/dive_fitness"          /tmp/multi_body_5.json
chk "dv-dcs"     "eng/tier163-div-764/decompression_sick2"   /tmp/multi_body_6.json
chk "dv-gst"     "eng/tier163-div-764/gas_toxicity2"         /tmp/multi_body_7.json
chk "dv-btr"     "eng/tier163-div-764/barotrauma2"           /tmp/multi_body_8.json
chk "dv-hbt"     "eng/tier163-div-764/hyperbaric_treat"      /tmp/multi_body_9.json
chk "mr-ssk"     "eng/tier163-mar-765/seasickness"           /tmp/multi_body_10.json
chk "mr-hyt"     "eng/tier163-mar-765/hypothermia"           /tmp/multi_body_11.json
chk "mr-drw"     "eng/tier163-mar-765/drowning"              /tmp/multi_body_12.json
chk "mr-env"     "eng/tier163-mar-765/envenomation"          /tmp/multi_body_13.json
chk "mr-dem"     "eng/tier163-mar-765/dive_emergency"        /tmp/multi_body_14.json
chk "ml-trg"     "eng/tier163-mil-766/triage"                /tmp/multi_body_15.json
chk "ml-cct"     "eng/tier163-mil-766/combat_casualty"       /tmp/multi_body_16.json
chk "ml-vcm"     "eng/tier163-mil-766/vaccine_mil"           /tmp/multi_body_17.json
chk "ml-bdf"     "eng/tier163-mil-766/biodefense"            /tmp/multi_body_18.json
chk "ml-ffd"     "eng/tier163-mil-766/fit_for_duty"          /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"