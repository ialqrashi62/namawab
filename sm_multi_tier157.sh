#!/usr/bin/env bash
# filepath: sm_multi_tier157.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "fm-fvt"     "eng/tier157-fm-739/visit"            /tmp/multi_body_0.json
chk "fm-scr"     "eng/tier157-fm-739/screening"        /tmp/multi_body_1.json
chk "fm-ccr"     "eng/tier157-fm-739/chronic_care"     /tmp/multi_body_2.json
chk "fm-hpr"     "eng/tier157-fm-739/health_promotion" /tmp/multi_body_3.json
chk "fm-fhi"     "eng/tier157-fm-739/family_history"   /tmp/multi_body_4.json
chk "gr-cga"     "eng/tier157-ger-740/cga"             /tmp/multi_body_5.json
chk "gr-cog"     "eng/tier157-ger-740/cognitive"       /tmp/multi_body_6.json
chk "gr-far"     "eng/tier157-ger-740/falls_assess"    /tmp/multi_body_7.json
chk "gr-dpc"     "eng/tier157-ger-740/deprescribing"   /tmp/multi_body_8.json
chk "gr-acp"     "eng/tier157-ger-740/advance_care"    /tmp/multi_body_9.json
chk "sm-spr"     "eng/tier157-sm-741/pre_participation" /tmp/multi_body_10.json
chk "sm-cnc"     "eng/tier157-sm-741/concussion"       /tmp/multi_body_11.json
chk "sm-acl"     "eng/tier157-sm-741/acl_rehab"        /tmp/multi_body_12.json
chk "sm-thr"     "eng/tier157-sm-741/throwing"         /tmp/multi_body_13.json
chk "sm-rec"     "eng/tier157-sm-741/recovery"         /tmp/multi_body_14.json
chk "va-tvl"     "eng/tier157-vac-742/travel_consult"  /tmp/multi_body_15.json
chk "va-alt"     "eng/tier157-vac-742/altitude"        /tmp/multi_body_16.json
chk "va-div"     "eng/tier157-vac-742/dive_med"        /tmp/multi_body_17.json
chk "va-vcn"     "eng/tier157-vac-742/vaccination"     /tmp/multi_body_18.json
chk "va-ocp"     "eng/tier157-vac-742/occupational"    /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"