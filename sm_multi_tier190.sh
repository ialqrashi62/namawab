#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier190_op1_891_op1_registration_assessment
chk tier190_op1_891_op1_registration_screening
chk tier190_op1_891_op1_registration_followup
chk tier190_op1_891_op1_registration_procedure
chk tier190_op1_891_op1_registration_outcome
chk tier190_op2_892_op2_vitals_assessment
chk tier190_op2_892_op2_vitals_screening
chk tier190_op2_892_op2_vitals_followup
chk tier190_op2_892_op2_vitals_procedure
chk tier190_op2_892_op2_vitals_outcome
chk tier190_op3_893_op3_provider_assessment
chk tier190_op3_893_op3_provider_screening
chk tier190_op3_893_op3_provider_followup
chk tier190_op3_893_op3_provider_procedure
chk tier190_op3_893_op3_provider_outcome
chk tier190_op4_894_op4_billing_assessment
chk tier190_op4_894_op4_billing_screening
chk tier190_op4_894_op4_billing_followup
chk tier190_op4_894_op4_billing_procedure
chk tier190_op4_894_op4_billing_outcome
chk tier190_op5_895_op5_followup_assessment
chk tier190_op5_895_op5_followup_screening
chk tier190_op5_895_op5_followup_followup
chk tier190_op5_895_op5_followup_procedure
chk tier190_op5_895_op5_followup_outcome

echo "TOTALS: pass=$pass fail=$fail"
