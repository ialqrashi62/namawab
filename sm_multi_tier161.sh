#!/usr/bin/env bash
# filepath: sm_multi_tier161.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "im-alr"     "eng/tier161-imu-755/allergy_assess"        /tmp/multi_body_0.json
chk "im-idf"     "eng/tier161-imu-755/immunodeficiency"      /tmp/multi_body_1.json
chk "im-aif"     "eng/tier161-imu-755/autoinflammatory"      /tmp/multi_body_2.json
chk "im-iga"     "eng/tier161-imu-755/iga_deficiency"        /tmp/multi_body_3.json
chk "im-hyp"     "eng/tier161-imu-755/hypersensitivity"      /tmp/multi_body_4.json
chk "he-anw"     "eng/tier161-hem-756/anemia_workup"         /tmp/multi_body_5.json
chk "he-cod"     "eng/tier161-hem-756/coag_disorder"         /tmp/multi_body_6.json
chk "he-trm"     "eng/tier161-hem-756/transfusion_med"       /tmp/multi_body_7.json
chk "he-hmm"     "eng/tier161-hem-756/hematologic_malignancy" /tmp/multi_body_8.json
chk "he-bnm"     "eng/tier161-hem-756/bone_marrow"           /tmp/multi_body_9.json
chk "mx-ftt"     "eng/tier161-max-757/facial_trauma"         /tmp/multi_body_10.json
chk "mx-ogn"     "eng/tier161-max-757/orthognathic_impl"     /tmp/multi_body_11.json
chk "mx-tmj"     "eng/tier161-max-757/tmj"                  /tmp/multi_body_12.json
chk "mx-sao"     "eng/tier161-max-757/sleep_apnea_oral"      /tmp/multi_body_13.json
chk "mx-clc"     "eng/tier161-max-757/cleft_care"            /tmp/multi_body_14.json
chk "po-fas"     "eng/tier161-pod-758/foot_assessment"       /tmp/multi_body_15.json
chk "po-dfp"     "eng/tier161-pod-758/diabetic_foot"         /tmp/multi_body_16.json
chk "po-bmn"     "eng/tier161-pod-758/biomechanics"          /tmp/multi_body_17.json
chk "po-nls"     "eng/tier161-pod-758/nail_surgery"          /tmp/multi_body_18.json
chk "po-wcd"     "eng/tier161-pod-758/wound_care"            /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"