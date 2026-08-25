#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier199_pc1_936_pc1_consult_assessment
chk tier199_pc1_936_pc1_consult_screening
chk tier199_pc1_936_pc1_consult_followup
chk tier199_pc1_936_pc1_consult_procedure
chk tier199_pc1_936_pc1_consult_outcome
chk tier199_pc2_937_pc2_symptom_assessment
chk tier199_pc2_937_pc2_symptom_screening
chk tier199_pc2_937_pc2_symptom_followup
chk tier199_pc2_937_pc2_symptom_procedure
chk tier199_pc2_937_pc2_symptom_outcome
chk tier199_pc3_938_pc3_care_assessment
chk tier199_pc3_938_pc3_care_screening
chk tier199_pc3_938_pc3_care_followup
chk tier199_pc3_938_pc3_care_procedure
chk tier199_pc3_938_pc3_care_outcome
chk tier199_pc4_939_pc4_support_assessment
chk tier199_pc4_939_pc4_support_screening
chk tier199_pc4_939_pc4_support_followup
chk tier199_pc4_939_pc4_support_procedure
chk tier199_pc4_939_pc4_support_outcome
chk tier199_pc5_940_pc5_end_assessment
chk tier199_pc5_940_pc5_end_screening
chk tier199_pc5_940_pc5_end_followup
chk tier199_pc5_940_pc5_end_procedure
chk tier199_pc5_940_pc5_end_outcome

echo "TOTALS: pass=$pass fail=$fail"
