#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier276_f1_1321_t276_e1_initial_assessment
chk tier276_f1_1321_t276_e1_initial_screening
chk tier276_f1_1321_t276_e1_initial_followup
chk tier276_f1_1321_t276_e1_initial_procedure
chk tier276_f1_1321_t276_e1_initial_outcome
chk tier276_f2_1322_t276_e2_review_assessment
chk tier276_f2_1322_t276_e2_review_screening
chk tier276_f2_1322_t276_e2_review_followup
chk tier276_f2_1322_t276_e2_review_procedure
chk tier276_f2_1322_t276_e2_review_outcome
chk tier276_f3_1323_t276_e3_recommend_assessment
chk tier276_f3_1323_t276_e3_recommend_screening
chk tier276_f3_1323_t276_e3_recommend_followup
chk tier276_f3_1323_t276_e3_recommend_procedure
chk tier276_f3_1323_t276_e3_recommend_outcome
chk tier276_f4_1324_t276_e4_followup_assessment
chk tier276_f4_1324_t276_e4_followup_screening
chk tier276_f4_1324_t276_e4_followup_followup
chk tier276_f4_1324_t276_e4_followup_procedure
chk tier276_f4_1324_t276_e4_followup_outcome
chk tier276_f5_1325_t276_e5_outcomes_assessment
chk tier276_f5_1325_t276_e5_outcomes_screening
chk tier276_f5_1325_t276_e5_outcomes_followup
chk tier276_f5_1325_t276_e5_outcomes_procedure
chk tier276_f5_1325_t276_e5_outcomes_outcome

echo "TOTALS: pass=$pass fail=$fail"
