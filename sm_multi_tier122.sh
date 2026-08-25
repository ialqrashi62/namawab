#!/bin/bash
# filepath: sm_multi_tier122.sh
BASE="https://jumanasoft.com"
TOKEN=$(node -e "console.log(require('jsonwebtoken').sign({tenant_id:'demo',role:'admin'},'demo_secret',{expiresIn:'1h'}))")
H="Authorization: Bearer $TOKEN"
PASS=0; FAIL=0
test_endpoint() {
  local mp=$1; local fn=$2; local bodyfile=$3
  local resp=$(curl -s -o /tmp/sm_t122_${fn}.json -w "%{http_code}" -X POST "$BASE${mp}/${fn}" -H "$H" -H "Content-Type: application/json" -H "x-tenant-id: demo" --data @$bodyfile)
  if [[ "$resp" == "200" ]] && grep -q '"ok":true' /tmp/sm_t122_${fn}.json; then
    echo "PASS $mp/$fn ($resp)"; PASS=$((PASS+1))
  else
    echo "FAIL $mp/$fn ($resp)"; FAIL=$((FAIL+1))
  fi
}
declare -a MOUNTS=("/api/telehealth_v2" "/api/devices_v2" "/api/mhealth_v2" "/api/rpm_v2")
declare -a FNS=("virtual_visit" "remote_monitoring" "tele_icu" "tele_consult" "digital_therapeutic" "implant_log" "device_alert" "wearable_sync" "smart_pump" "bedside_monitor" "patient_app" "secure_message" "patient_education_video" "symptom_tracker" "ai_chatbot" "rpm_enrollment" "reading_outlier" "med_adherence" "care_pathway" "coaching")
mi=0; fi=0
while [[ $mi -lt ${#MOUNTS[@]} ]]; do
  while [[ $fi -lt 5 ]] && [[ $((mi*5+fi)) -lt 20 ]]; do
    fn=${FNS[$((mi*5+fi))]}
    bodyfile="/tmp/multi_body_$((mi*5+fi)).json"
    test_endpoint "${MOUNTS[$mi]}" "$fn" "$bodyfile"
    fi=$((fi+1))
  done
  fi=0; mi=$((mi+1))
done
echo "SMOKE: PASS=$PASS FAIL=$FAIL"