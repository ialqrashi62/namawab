#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier200_fn1_941_fn1_intake_assessment
chk tier200_fn1_941_fn1_intake_screening
chk tier200_fn1_941_fn1_intake_followup
chk tier200_fn1_941_fn1_intake_procedure
chk tier200_fn1_941_fn1_intake_outcome
chk tier200_fn2_942_fn2_assess_assessment
chk tier200_fn2_942_fn2_assess_screening
chk tier200_fn2_942_fn2_assess_followup
chk tier200_fn2_942_fn2_assess_procedure
chk tier200_fn2_942_fn2_assess_outcome
chk tier200_fn3_943_fn3_plan_assessment
chk tier200_fn3_943_fn3_plan_screening
chk tier200_fn3_943_fn3_plan_followup
chk tier200_fn3_943_fn3_plan_procedure
chk tier200_fn3_943_fn3_plan_outcome
chk tier200_fn4_944_fn4_followup_assessment
chk tier200_fn4_944_fn4_followup_screening
chk tier200_fn4_944_fn4_followup_followup
chk tier200_fn4_944_fn4_followup_procedure
chk tier200_fn4_944_fn4_followup_outcome
chk tier200_fn5_945_fn5_outcome_assessment
chk tier200_fn5_945_fn5_outcome_screening
chk tier200_fn5_945_fn5_outcome_followup
chk tier200_fn5_945_fn5_outcome_procedure
chk tier200_fn5_945_fn5_outcome_outcome

echo "TOTALS: pass=$pass fail=$fail"
