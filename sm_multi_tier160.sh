#!/usr/bin/env bash
# filepath: sm_multi_tier160.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "tl-vid"     "eng/tier160-tel-751/video_visit"     /tmp/multi_body_0.json
chk "tl-ems"     "eng/tier160-tel-751/ehr_message"     /tmp/multi_body_1.json
chk "tl-ptp"     "eng/tier160-tel-751/patient_portal"  /tmp/multi_body_2.json
chk "tl-apr"     "eng/tier160-tel-751/app_remote"      /tmp/multi_body_3.json
chk "tl-rmn"     "eng/tier160-tel-751/remote_monitor"   /tmp/multi_body_4.json
chk "ai-cds"     "eng/tier160-ai-752/cds"              /tmp/multi_body_5.json
chk "ai-rsk"     "eng/tier160-ai-752/risk_score"       /tmp/multi_body_6.json
chk "ai-chb"     "eng/tier160-ai-752/chatbot"          /tmp/multi_body_7.json
chk "ai-imi"     "eng/tier160-ai-752/imaging_ai"       /tmp/multi_body_8.json
chk "ai-gai"     "eng/tier160-ai-752/genomic_ai"       /tmp/multi_body_9.json
chk "rs-trl"     "eng/tier160-rs-753/trial"            /tmp/multi_body_10.json
chk "rs-crt"     "eng/tier160-rs-753/cohort"           /tmp/multi_body_11.json
chk "rs-rgy"     "eng/tier160-rs-753/registry"         /tmp/multi_body_12.json
chk "rs-iom"     "eng/tier160-rs-753/iomt"             /tmp/multi_body_13.json
chk "rs-ehr"     "eng/tier160-rs-753/ehr_config"       /tmp/multi_body_14.json
chk "lb-lab"     "eng/tier160-lab-754/lab_order"       /tmp/multi_body_15.json
chk "lb-lar"     "eng/tier160-lab-754/lab_result"      /tmp/multi_body_16.json
chk "lb-mic"     "eng/tier160-lab-754/micro"           /tmp/multi_body_17.json
chk "lb-blb"     "eng/tier160-lab-754/blood_bank"      /tmp/multi_body_18.json
chk "lb-mol"     "eng/tier160-lab-754/molecular_lab"   /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"