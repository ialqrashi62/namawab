#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier208_c1_956_t208_e1_consult_assessment
chk tier208_c1_956_t208_e1_consult_screening
chk tier208_c1_956_t208_e1_consult_followup
chk tier208_c1_956_t208_e1_consult_procedure
chk tier208_c1_956_t208_e1_consult_outcome
chk tier208_c2_957_t208_e2_diag_assessment
chk tier208_c2_957_t208_e2_diag_screening
chk tier208_c2_957_t208_e2_diag_followup
chk tier208_c2_957_t208_e2_diag_procedure
chk tier208_c2_957_t208_e2_diag_outcome
chk tier208_c3_958_t208_e3_tx_assessment
chk tier208_c3_958_t208_e3_tx_screening
chk tier208_c3_958_t208_e3_tx_followup
chk tier208_c3_958_t208_e3_tx_procedure
chk tier208_c3_958_t208_e3_tx_outcome
chk tier208_c4_959_t208_e4_edu_assessment
chk tier208_c4_959_t208_e4_edu_screening
chk tier208_c4_959_t208_e4_edu_followup
chk tier208_c4_959_t208_e4_edu_procedure
chk tier208_c4_959_t208_e4_edu_outcome
chk tier208_c5_960_t208_e5_outcome_assessment
chk tier208_c5_960_t208_e5_outcome_screening
chk tier208_c5_960_t208_e5_outcome_followup
chk tier208_c5_960_t208_e5_outcome_procedure
chk tier208_c5_960_t208_e5_outcome_outcome

echo "TOTALS: pass=$pass fail=$fail"
