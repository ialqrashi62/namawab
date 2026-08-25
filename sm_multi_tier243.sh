#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier243_c1_1156_t243_e1_consult_assessment
chk tier243_c1_1156_t243_e1_consult_screening
chk tier243_c1_1156_t243_e1_consult_followup
chk tier243_c1_1156_t243_e1_consult_procedure
chk tier243_c1_1156_t243_e1_consult_outcome
chk tier243_c2_1157_t243_e2_diag_assessment
chk tier243_c2_1157_t243_e2_diag_screening
chk tier243_c2_1157_t243_e2_diag_followup
chk tier243_c2_1157_t243_e2_diag_procedure
chk tier243_c2_1157_t243_e2_diag_outcome
chk tier243_c3_1158_t243_e3_tx_assessment
chk tier243_c3_1158_t243_e3_tx_screening
chk tier243_c3_1158_t243_e3_tx_followup
chk tier243_c3_1158_t243_e3_tx_procedure
chk tier243_c3_1158_t243_e3_tx_outcome
chk tier243_c4_1159_t243_e4_edu_assessment
chk tier243_c4_1159_t243_e4_edu_screening
chk tier243_c4_1159_t243_e4_edu_followup
chk tier243_c4_1159_t243_e4_edu_procedure
chk tier243_c4_1159_t243_e4_edu_outcome
chk tier243_c5_1160_t243_e5_outcome_assessment
chk tier243_c5_1160_t243_e5_outcome_screening
chk tier243_c5_1160_t243_e5_outcome_followup
chk tier243_c5_1160_t243_e5_outcome_procedure
chk tier243_c5_1160_t243_e5_outcome_outcome

echo "TOTALS: pass=$pass fail=$fail"
