#!/bin/bash
# filepath: sm_multi_tier132.sh
BASE="https://jumanasoft.com"
TOKEN=$(node -e "console.log(require('jsonwebtoken').sign({tenant_id:'demo',role:'admin'},'demo_secret',{expiresIn:'1h'}))")
H="Authorization: Bearer $TOKEN"
PASS=0; FAIL=0
test_endpoint() {
  local mp=$1; local fn=$2; local bodyfile=$3
  local resp=$(curl -s -o /tmp/sm_t132_${fn}.json -w "%{http_code}" -X POST "$BASE${mp}/${fn}" -H "$H" -H "Content-Type: application/json" -H "x-tenant-id: demo" --data @$bodyfile)
  if [[ "$resp" == "200" ]] && grep -q '"ok":true' /tmp/sm_t132_${fn}.json; then
    echo "PASS $mp/$fn ($resp)"; PASS=$((PASS+1))
  else
    echo "FAIL $mp/$fn ($resp)"; FAIL=$((FAIL+1))
  fi
}
declare -a MOUNTS=("/api/gastro_v2" "/api/pulm_v2" "/api/endo_v3" "/api/rheum_v2")
declare -a FNS=("ercp" "liver_biopsy" "us_elastography" "manometry" "ct_enterography" "pft" "sleep_study" "vent_weaning" "tb_screening" "oxygen_therapy" "diabetes_mgmt" "thyroid" "adrenal" "reproductive_endocrine" "bone_density" "arthrocentesis" "connective_tissue" "dmards" "rehab_assess" "das28")
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