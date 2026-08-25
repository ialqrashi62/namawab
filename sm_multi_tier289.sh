#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier289_a1_1386_t289_e1_intake_assessment
chk tier289_a1_1386_t289_e1_intake_screening
chk tier289_a1_1386_t289_e1_intake_followup
chk tier289_a1_1386_t289_e1_intake_procedure
chk tier289_a1_1386_t289_e1_intake_outcome
chk tier289_a2_1387_t289_e2_screen_assessment
chk tier289_a2_1387_t289_e2_screen_screening
chk tier289_a2_1387_t289_e2_screen_followup
chk tier289_a2_1387_t289_e2_screen_procedure
chk tier289_a2_1387_t289_e2_screen_outcome
chk tier289_a3_1388_t289_e3_assess_assessment
chk tier289_a3_1388_t289_e3_assess_screening
chk tier289_a3_1388_t289_e3_assess_followup
chk tier289_a3_1388_t289_e3_assess_procedure
chk tier289_a3_1388_t289_e3_assess_outcome
chk tier289_a4_1389_t289_e4_plan_assessment
chk tier289_a4_1389_t289_e4_plan_screening
chk tier289_a4_1389_t289_e4_plan_followup
chk tier289_a4_1389_t289_e4_plan_procedure
chk tier289_a4_1389_t289_e4_plan_outcome
chk tier289_a5_1390_t289_e5_outcome_assessment
chk tier289_a5_1390_t289_e5_outcome_screening
chk tier289_a5_1390_t289_e5_outcome_followup
chk tier289_a5_1390_t289_e5_outcome_procedure
chk tier289_a5_1390_t289_e5_outcome_outcome

echo "TOTALS: pass=$pass fail=$fail"
