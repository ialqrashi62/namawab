#!/usr/bin/env bash
# filepath: sm_multi_tier148.sh
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
chk "onc-stg"      "eng/tier148-onc-701/staging"           /tmp/multi_body_0.json
chk "onc-tnm"      "eng/tier148-onc-701/tnm"               /tmp/multi_body_1.json
chk "onc-trg"      "eng/tier148-onc-701/targeted"          /tmp/multi_body_2.json
chk "onc-rad"      "eng/tier148-onc-701/rad_onc"           /tmp/multi_body_3.json
chk "onc-flu"      "eng/tier148-onc-701/follow_up"         /tmp/multi_body_4.json
chk "obg-prn"      "eng/tier148-obg-702/prenatal"          /tmp/multi_body_5.json
chk "obg-lbr"      "eng/tier148-obg-702/labor"             /tmp/multi_body_6.json
chk "obg-dlv"      "eng/tier148-obg-702/delivery"          /tmp/multi_body_7.json
chk "obg-ppc"      "eng/tier148-obg-702/pp_care"           /tmp/multi_body_8.json
chk "obg-gyn"      "eng/tier148-obg-702/gyn_proc"          /tmp/multi_body_9.json
chk "nic-adm"      "eng/tier148-nic-703/admit"             /tmp/multi_body_10.json
chk "nic-vnt"      "eng/tier148-nic-703/vent"              /tmp/multi_body_11.json
chk "nic-fed"      "eng/tier148-nic-703/feeding"           /tmp/multi_body_12.json
chk "nic-ssn"      "eng/tier148-nic-703/sepsis_screen"     /tmp/multi_body_13.json
chk "nic-dc"       "eng/tier148-nic-703/discharge"         /tmp/multi_body_14.json
chk "bld-dsn"      "eng/tier148-bld-704/donor_screen"      /tmp/multi_body_15.json
chk "bld-unt"      "eng/tier148-bld-704/unit"              /tmp/multi_body_16.json
chk "bld-crm"      "eng/tier148-bld-704/crossmatch"        /tmp/multi_body_17.json
chk "bld-tfe"      "eng/tier148-bld-704/transfusion_event" /tmp/multi_body_18.json
chk "bld-inv"      "eng/tier148-bld-704/inventory"         /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"