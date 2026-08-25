#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier202_nu1_951_nu1_assess_assessment
chk tier202_nu1_951_nu1_assess_screening
chk tier202_nu1_951_nu1_assess_followup
chk tier202_nu1_951_nu1_assess_procedure
chk tier202_nu1_951_nu1_assess_outcome
chk tier202_nu2_952_nu2_plan_assessment
chk tier202_nu2_952_nu2_plan_screening
chk tier202_nu2_952_nu2_plan_followup
chk tier202_nu2_952_nu2_plan_procedure
chk tier202_nu2_952_nu2_plan_outcome
chk tier202_nu3_953_nu3_implement_assessment
chk tier202_nu3_953_nu3_implement_screening
chk tier202_nu3_953_nu3_implement_followup
chk tier202_nu3_953_nu3_implement_procedure
chk tier202_nu3_953_nu3_implement_outcome
chk tier202_nu4_954_nu4_evaluate_assessment
chk tier202_nu4_954_nu4_evaluate_screening
chk tier202_nu4_954_nu4_evaluate_followup
chk tier202_nu4_954_nu4_evaluate_procedure
chk tier202_nu4_954_nu4_evaluate_outcome
chk tier202_nu5_955_nu5_followup_assessment
chk tier202_nu5_955_nu5_followup_screening
chk tier202_nu5_955_nu5_followup_followup
chk tier202_nu5_955_nu5_followup_procedure
chk tier202_nu5_955_nu5_followup_outcome

echo "TOTALS: pass=$pass fail=$fail"
