#!/usr/bin/env bash
# filepath: sm_multi_tier168.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "rh-ras"     "eng/tier168-reh-783/rehab_assessment"     /tmp/multi_body_0.json
chk "rh-rgl"     "eng/tier168-reh-783/rehab_goals"          /tmp/multi_body_1.json
chk "rh-fpr"     "eng/tier168-reh-783/functional_progress" /tmp/multi_body_2.json
chk "rh-dpl"     "eng/tier168-reh-783/discharge_planning"   /tmp/multi_body_3.json
chk "rh-aeq"     "eng/tier168-reh-783/adaptive_equipment"   /tmp/multi_body_4.json
chk "pd-wch"     "eng/tier168-ped-784/well_child"           /tmp/multi_body_5.json
chk "pd-gch"     "eng/tier168-ped-784/growth_chart"         /tmp/multi_body_6.json
chk "pd-imp"     "eng/tier168-ped-784/immunization_peds"    /tmp/multi_body_7.json
chk "pd-dsc"     "eng/tier168-ped-784/developmental_screen" /tmp/multi_body_8.json
chk "pd-acc"     "eng/tier168-ped-784/adolescent_care"      /tmp/multi_body_9.json
chk "gy-pex"     "eng/tier168-gyn-785/pelvic_exam"          /tmp/multi_body_10.json
chk "gy-cnt"     "eng/tier168-gyn-785/contraception"        /tmp/multi_body_11.json
chk "gy-iud"     "eng/tier168-gyn-785/iud_placement"        /tmp/multi_body_12.json
chk "gy-fev"     "eng/tier168-gyn-785/fertility_eval"       /tmp/multi_body_13.json
chk "gy-mev"     "eng/tier168-gyn-785/menopause_eval"       /tmp/multi_body_14.json
chk "ob-pnv"     "eng/tier168-obg-786/prenatal_visit"       /tmp/multi_body_15.json
chk "ob-lbt"     "eng/tier168-obg-786/lab_test"             /tmp/multi_body_16.json
chk "ob-usd"     "eng/tier168-obg-786/ultrasound"           /tmp/multi_body_17.json
chk "ob-dlv"     "eng/tier168-obg-786/delivery"             /tmp/multi_body_18.json
chk "ob-pps"     "eng/tier168-obg-786/postpartum"           /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"