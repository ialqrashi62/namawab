#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier278_h1_1331_t278_e1_admit_assessment
chk tier278_h1_1331_t278_e1_admit_screening
chk tier278_h1_1331_t278_e1_admit_followup
chk tier278_h1_1331_t278_e1_admit_procedure
chk tier278_h1_1331_t278_e1_admit_outcome
chk tier278_h2_1332_t278_e2_rounding_assessment
chk tier278_h2_1332_t278_e2_rounding_screening
chk tier278_h2_1332_t278_e2_rounding_followup
chk tier278_h2_1332_t278_e2_rounding_procedure
chk tier278_h2_1332_t278_e2_rounding_outcome
chk tier278_h3_1333_t278_e3_procedure_assessment
chk tier278_h3_1333_t278_e3_procedure_screening
chk tier278_h3_1333_t278_e3_procedure_followup
chk tier278_h3_1333_t278_e3_procedure_procedure
chk tier278_h3_1333_t278_e3_procedure_outcome
chk tier278_h4_1334_t278_e4_discharge_assessment
chk tier278_h4_1334_t278_e4_discharge_screening
chk tier278_h4_1334_t278_e4_discharge_followup
chk tier278_h4_1334_t278_e4_discharge_procedure
chk tier278_h4_1334_t278_e4_discharge_outcome
chk tier278_h5_1335_t278_e5_transfer_assessment
chk tier278_h5_1335_t278_e5_transfer_screening
chk tier278_h5_1335_t278_e5_transfer_followup
chk tier278_h5_1335_t278_e5_transfer_procedure
chk tier278_h5_1335_t278_e5_transfer_outcome

echo "TOTALS: pass=$pass fail=$fail"
