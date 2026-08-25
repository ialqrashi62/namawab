#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier187_ed1_876_ed1_intake_assessment
chk tier187_ed1_876_ed1_intake_screening
chk tier187_ed1_876_ed1_intake_followup
chk tier187_ed1_876_ed1_intake_procedure
chk tier187_ed1_876_ed1_intake_outcome
chk tier187_ed2_877_ed2_triage_assessment
chk tier187_ed2_877_ed2_triage_screening
chk tier187_ed2_877_ed2_triage_followup
chk tier187_ed2_877_ed2_triage_procedure
chk tier187_ed2_877_ed2_triage_outcome
chk tier187_ed3_878_ed3_workup_assessment
chk tier187_ed3_878_ed3_workup_screening
chk tier187_ed3_878_ed3_workup_followup
chk tier187_ed3_878_ed3_workup_procedure
chk tier187_ed3_878_ed3_workup_outcome
chk tier187_ed4_879_ed4_treatment_assessment
chk tier187_ed4_879_ed4_treatment_screening
chk tier187_ed4_879_ed4_treatment_followup
chk tier187_ed4_879_ed4_treatment_procedure
chk tier187_ed4_879_ed4_treatment_outcome
chk tier187_ed5_880_ed5_disposition_assessment
chk tier187_ed5_880_ed5_disposition_screening
chk tier187_ed5_880_ed5_disposition_followup
chk tier187_ed5_880_ed5_disposition_procedure
chk tier187_ed5_880_ed5_disposition_outcome

echo "TOTALS: pass=$pass fail=$fail"
