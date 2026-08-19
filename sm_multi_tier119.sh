#!/bin/bash
# filepath: sm_multi_tier119.sh
BASE="https://jumanasoft.com"
TOKEN=$(node -e "console.log(require('jsonwebtoken').sign({tenant_id:'demo',role:'admin'},'demo_secret',{expiresIn:'1h'}))")
H="Authorization: Bearer $TOKEN"
PASS=0; FAIL=0
test_endpoint() {
  local mp=$1; local fn=$2; local bodyfile=$3
  local resp=$(curl -s -o /tmp/sm_t119_${fn}.json -w "%{http_code}" -X POST "$BASE${mp}/${fn}" -H "$H" -H "Content-Type: application/json" -H "x-tenant-id: demo" --data @$bodyfile)
  if [[ "$resp" == "200" ]] && grep -q '"ok":true' /tmp/sm_t119_${fn}.json; then
    echo "PASS $mp/$fn ($resp)"; PASS=$((PASS+1))
  else
    echo "FAIL $mp/$fn ($resp)"; FAIL=$((FAIL+1))
  fi
}
declare -a MOUNTS=("/api/bed_mgmt_v2" "/api/transport_v2" "/api/housekeeping_v2" "/api/security_v2")
declare -a FNS=("bed_assignment" "bed_transfer" "bed_cleaning" "bed_status_update" "capacity_dashboard" "transport_request" "transport_completion" "courier_service" "equipment_transport" "transport_dispatch" "room_cleaning" "linen_request" "waste_disposal" "pest_control" "maintenance_request" "incident_report" "visitor_management" "access_control_log" "surveillance_alert" "code_silver")
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