#!/usr/bin/env bash
# filepath: sm_multi_tier169.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "ic-vnt"     "eng/tier169-icu-787/ventilator"           /tmp/multi_body_0.json
chk "ic-vtr"     "eng/tier169-icu-787/vital_trend"          /tmp/multi_body_1.json
chk "ic-cst"     "eng/tier169-icu-787/code_status"          /tmp/multi_body_2.json
chk "ic-rnd"     "eng/tier169-icu-787/rounding"             /tmp/multi_body_3.json
chk "ic-iot"     "eng/tier169-icu-787/icu_outcome"          /tmp/multi_body_4.json
chk "er-pad"     "eng/tier169-emr-788/patient_admission"    /tmp/multi_body_5.json
chk "er-nas"     "eng/tier169-emr-788/nursing_assessment"   /tmp/multi_body_6.json
chk "er-mad"     "eng/tier169-emr-788/med_admin"            /tmp/multi_body_7.json
chk "er-cpl"     "eng/tier169-emr-788/care_plan"            /tmp/multi_body_8.json
chk "er-dss"     "eng/tier169-emr-788/discharge_summary"    /tmp/multi_body_9.json
chk "tr-tcl"     "eng/tier169-tra-789/trauma_call"          /tmp/multi_body_10.json
chk "tr-mtr"     "eng/tier169-tra-789/massive_transfusion"  /tmp/multi_body_11.json
chk "tr-tim"     "eng/tier169-tra-789/trauma_imaging"       /tmp/multi_body_12.json
chk "tr-ins"     "eng/tier169-tra-789/injury_severity"      /tmp/multi_body_13.json
chk "tr-toc"     "eng/tier169-tra-789/trauma_outcome"       /tmp/multi_body_14.json
chk "cd-cpe"     "eng/tier169-cad-790/chest_pain_eval"      /tmp/multi_body_15.json
chk "cd-stm"     "eng/tier169-cad-790/stemi"                /tmp/multi_body_16.json
chk "cd-str"     "eng/tier169-cad-790/stroke_alert"         /tmp/multi_body_17.json
chk "cd-sep"     "eng/tier169-cad-790/sepsis"               /tmp/multi_body_18.json
chk "cd-cbl"     "eng/tier169-cad-790/code_blue"            /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"