#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier189_ip1_886_ip1_admit_assessment
chk tier189_ip1_886_ip1_admit_screening
chk tier189_ip1_886_ip1_admit_followup
chk tier189_ip1_886_ip1_admit_procedure
chk tier189_ip1_886_ip1_admit_outcome
chk tier189_ip2_887_ip2_rounding_assessment
chk tier189_ip2_887_ip2_rounding_screening
chk tier189_ip2_887_ip2_rounding_followup
chk tier189_ip2_887_ip2_rounding_procedure
chk tier189_ip2_887_ip2_rounding_outcome
chk tier189_ip3_888_ip3_procedure_assessment
chk tier189_ip3_888_ip3_procedure_screening
chk tier189_ip3_888_ip3_procedure_followup
chk tier189_ip3_888_ip3_procedure_procedure
chk tier189_ip3_888_ip3_procedure_outcome
chk tier189_ip4_889_ip4_discharge_assessment
chk tier189_ip4_889_ip4_discharge_screening
chk tier189_ip4_889_ip4_discharge_followup
chk tier189_ip4_889_ip4_discharge_procedure
chk tier189_ip4_889_ip4_discharge_outcome
chk tier189_ip5_890_ip5_transfer_assessment
chk tier189_ip5_890_ip5_transfer_screening
chk tier189_ip5_890_ip5_transfer_followup
chk tier189_ip5_890_ip5_transfer_procedure
chk tier189_ip5_890_ip5_transfer_outcome

echo "TOTALS: pass=$pass fail=$fail"
