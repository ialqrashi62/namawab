#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier288_h1_1381_t288_e1_admit_assessment
chk tier288_h1_1381_t288_e1_admit_screening
chk tier288_h1_1381_t288_e1_admit_followup
chk tier288_h1_1381_t288_e1_admit_procedure
chk tier288_h1_1381_t288_e1_admit_outcome
chk tier288_h2_1382_t288_e2_rounding_assessment
chk tier288_h2_1382_t288_e2_rounding_screening
chk tier288_h2_1382_t288_e2_rounding_followup
chk tier288_h2_1382_t288_e2_rounding_procedure
chk tier288_h2_1382_t288_e2_rounding_outcome
chk tier288_h3_1383_t288_e3_procedure_assessment
chk tier288_h3_1383_t288_e3_procedure_screening
chk tier288_h3_1383_t288_e3_procedure_followup
chk tier288_h3_1383_t288_e3_procedure_procedure
chk tier288_h3_1383_t288_e3_procedure_outcome
chk tier288_h4_1384_t288_e4_discharge_assessment
chk tier288_h4_1384_t288_e4_discharge_screening
chk tier288_h4_1384_t288_e4_discharge_followup
chk tier288_h4_1384_t288_e4_discharge_procedure
chk tier288_h4_1384_t288_e4_discharge_outcome
chk tier288_h5_1385_t288_e5_transfer_assessment
chk tier288_h5_1385_t288_e5_transfer_screening
chk tier288_h5_1385_t288_e5_transfer_followup
chk tier288_h5_1385_t288_e5_transfer_procedure
chk tier288_h5_1385_t288_e5_transfer_outcome

echo "TOTALS: pass=$pass fail=$fail"
