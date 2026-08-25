#!/usr/bin/env bash
# filepath: sm_multi_tier153.sh
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
chk "pon-lkm"     "eng/tier153-pon-721/leukemia"      /tmp/multi_body_0.json
chk "pon-btn"     "eng/tier153-pon-721/brain_tumor"   /tmp/multi_body_1.json
chk "pon-sol"     "eng/tier153-pon-721/solid_peds"    /tmp/multi_body_2.json
chk "pon-chp"     "eng/tier153-pon-721/chemo_peds"    /tmp/multi_body_3.json
chk "pon-lef"     "eng/tier153-pon-721/late_effects"  /tmp/multi_body_4.json
chk "bmt-dmt"     "eng/tier153-bmt-722/donor_match"   /tmp/multi_body_5.json
chk "bmt-hvs"     "eng/tier153-bmt-722/harvest"       /tmp/multi_body_6.json
chk "bmt-cnd"     "eng/tier153-bmt-722/conditioning"  /tmp/multi_body_7.json
chk "bmt-eng"     "eng/tier153-bmt-722/engraftment"   /tmp/multi_body_8.json
chk "bmt-gvd"     "eng/tier153-bmt-722/gvhd"          /tmp/multi_body_9.json
chk "phm-skc"     "eng/tier153-phem-723/sickle"        /tmp/multi_body_10.json
chk "phm-hmb"     "eng/tier153-phem-723/hemophilia"    /tmp/multi_body_11.json
chk "phm-thl"     "eng/tier153-phem-723/thalassemia"   /tmp/multi_body_12.json
chk "phm-itp"     "eng/tier153-phem-723/itp"           /tmp/multi_body_13.json
chk "phm-tnp"     "eng/tier153-phem-723/transfusion_peds" /tmp/multi_body_14.json
chk "pic-pcu"     "eng/tier153-pic-724/picu_admit"     /tmp/multi_body_15.json
chk "pic-pvn"     "eng/tier153-pic-724/picu_vent"      /tmp/multi_body_16.json
chk "pic-pdr"     "eng/tier153-pic-724/picu_drugs"     /tmp/multi_body_17.json
chk "pic-pss"     "eng/tier153-pic-724/sepsis_peds"    /tmp/multi_body_18.json
chk "pic-poc"     "eng/tier153-pic-724/picu_outcome"   /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"