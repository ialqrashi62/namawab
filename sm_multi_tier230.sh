#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier230_e1_1091_t230_e1_intake_assessment
chk tier230_e1_1091_t230_e1_intake_screening
chk tier230_e1_1091_t230_e1_intake_followup
chk tier230_e1_1091_t230_e1_intake_procedure
chk tier230_e1_1091_t230_e1_intake_outcome
chk tier230_e2_1092_t230_e2_exam_assessment
chk tier230_e2_1092_t230_e2_exam_screening
chk tier230_e2_1092_t230_e2_exam_followup
chk tier230_e2_1092_t230_e2_exam_procedure
chk tier230_e2_1092_t230_e2_exam_outcome
chk tier230_e3_1093_t230_e3_plan_assessment
chk tier230_e3_1093_t230_e3_plan_screening
chk tier230_e3_1093_t230_e3_plan_followup
chk tier230_e3_1093_t230_e3_plan_procedure
chk tier230_e3_1093_t230_e3_plan_outcome
chk tier230_e4_1094_t230_e4_execute_assessment
chk tier230_e4_1094_t230_e4_execute_screening
chk tier230_e4_1094_t230_e4_execute_followup
chk tier230_e4_1094_t230_e4_execute_procedure
chk tier230_e4_1094_t230_e4_execute_outcome
chk tier230_e5_1095_t230_e5_review_assessment
chk tier230_e5_1095_t230_e5_review_screening
chk tier230_e5_1095_t230_e5_review_followup
chk tier230_e5_1095_t230_e5_review_procedure
chk tier230_e5_1095_t230_e5_review_outcome

echo "TOTALS: pass=$pass fail=$fail"
