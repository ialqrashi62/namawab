#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier205_ad1_966_ad1_admit_assessment
chk tier205_ad1_966_ad1_admit_screening
chk tier205_ad1_966_ad1_admit_followup
chk tier205_ad1_966_ad1_admit_procedure
chk tier205_ad1_966_ad1_admit_outcome
chk tier205_ad2_967_ad2_triage_assessment
chk tier205_ad2_967_ad2_triage_screening
chk tier205_ad2_967_ad2_triage_followup
chk tier205_ad2_967_ad2_triage_procedure
chk tier205_ad2_967_ad2_triage_outcome
chk tier205_ad3_968_ad3_route_assessment
chk tier205_ad3_968_ad3_route_screening
chk tier205_ad3_968_ad3_route_followup
chk tier205_ad3_968_ad3_route_procedure
chk tier205_ad3_968_ad3_route_outcome
chk tier205_ad4_969_ad4_track_assessment
chk tier205_ad4_969_ad4_track_screening
chk tier205_ad4_969_ad4_track_followup
chk tier205_ad4_969_ad4_track_procedure
chk tier205_ad4_969_ad4_track_outcome
chk tier205_ad5_970_ad5_discharge_assessment
chk tier205_ad5_970_ad5_discharge_screening
chk tier205_ad5_970_ad5_discharge_followup
chk tier205_ad5_970_ad5_discharge_procedure
chk tier205_ad5_970_ad5_discharge_outcome

echo "TOTALS: pass=$pass fail=$fail"
