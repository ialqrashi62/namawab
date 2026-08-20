#!/usr/bin/env bash
# filepath: sm_multi_tier172.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "bn-pev"     "eng/tier172-bun-799/pain_evaluation"       /tmp/multi_body_0.json
chk "bn-nvb"     "eng/tier172-bun-799/nerve_block"           /tmp/multi_body_1.json
chk "bn-epi"     "eng/tier172-bun-799/epidural"              /tmp/multi_body_2.json
chk "bn-pca"     "eng/tier172-bun-799/pca_pump"              /tmp/multi_body_3.json
chk "bn-mml"     "eng/tier172-bun-799/multimodal"            /tmp/multi_body_4.json
chk "car-crb"    "eng/tier172-car-805/cardiac_rehab"         /tmp/multi_body_5.json
chk "car-hf_"    "eng/tier172-car-805/heart_failure"         /tmp/multi_body_6.json
chk "car-arr"    "eng/tier172-car-805/arrhythmia"            /tmp/multi_body_7.json
chk "car-pci"    "eng/tier172-car-805/pci"                   /tmp/multi_body_8.json
chk "car-vlv"    "eng/tier172-car-805/valve_surgery"         /tmp/multi_body_9.json
chk "gn-cvs"     "eng/tier172-gyn-804/cervical_screen"       /tmp/multi_body_10.json
chk "gn-ovs"     "eng/tier172-gyn-804/ovarian_screen"        /tmp/multi_body_11.json
chk "gn-emb"     "eng/tier172-gyn-804/endometrial_biopsy"    /tmp/multi_body_12.json
chk "gn-hys"     "eng/tier172-gyn-804/hysterectomy"          /tmp/multi_body_13.json
chk "gn-oop"     "eng/tier172-gyn-804/oophorectomy"          /tmp/multi_body_14.json
chk "nu-sfk"     "eng/tier172-neu-802/stroke_follow"         /tmp/multi_body_15.json
chk "nu-epf"     "eng/tier172-neu-802/epilepsy_follow"       /tmp/multi_body_16.json
chk "nu-pkf"     "eng/tier172-neu-802/parkinson_follow"      /tmp/multi_body_17.json
chk "nu-msf"     "eng/tier172-neu-802/ms_follow"             /tmp/multi_body_18.json
chk "nu-mgr"     "eng/tier172-neu-802/migraine"              /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"