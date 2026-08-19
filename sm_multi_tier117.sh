#!/bin/bash
# filepath: sm_multi_tier117.sh
BASE="https://jumanasoft.com"
TOKEN=$(node -e "console.log(require('jsonwebtoken').sign({tenant_id:'demo',role:'admin'},'demo_secret',{expiresIn:'1h'}))")
H="Authorization: Bearer $TOKEN"
PASS=0; FAIL=0
test_endpoint() {
  local mp=$1; local fn=$2; local bodyfile=$3
  local resp=$(curl -s -o /tmp/sm_t117_${fn}.json -w "%{http_code}" -X POST "$BASE/api/mp$fn" -H "$H" -H "Content-Type: application/json" -H "x-tenant-id: demo" --data @$bodyfile)
  if [[ "$resp" == "200" ]] && grep -q '"ok":true' /tmp/sm_t117_${fn}.json; then
    echo "PASS $mp/$fn ($resp)"; PASS=$((PASS+1))
  else
    echo "FAIL $mp/$fn ($resp)"; FAIL=$((FAIL+1))
  fi
}
declare -a MOUNTS=("/api/workflow_v2" "/api/cds_v2" "/api/quality_metric_v2" "/api/credentialing_v2")
declare -a FNS=("handoff_sbar" "protocol_activation" "order_set" "rounding_list" "discharge_checklist" "drug_interaction" "renal_dose_alert" "sepsis_alert" "pressure_ulcer_alert" "fall_alert" "core_measure" "ami_performance" "stroke_performance" "vte_performance" "patient_satisfaction" "privilege_request" "privilege_renewal" "peer_review" "license_verification" "credentialing_renewal")
mi=0; fi=0
while [[ $mi -lt ${#MOUNTS[@]} ]]; do
  while [[ $fi -lt 5 ]] && [[ $((mi*5+fi)) -lt 20 ]]; do
    fn=${FNS[$((mi*5+fi))]}
    bodyfile="C:\\tmp\\multi_body_$((mi*5+fi)).json"
    if [[ -f "/tmp/multi_body_$((mi*5+fi)).json" ]]; then bodyfile="/tmp/multi_body_$((mi*5+fi)).json"; fi
    test_endpoint "${MOUNTS[$mi]}" "$fn" "$bodyfile"
    fi=$((fi+1))
  done
  fi=0; mi=$((mi+1))
done
echo "SMOKE: PASS=$PASS FAIL=$FAIL"