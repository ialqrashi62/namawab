#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier287_g1_1376_t287_e1_history_assessment
chk tier287_g1_1376_t287_e1_history_screening
chk tier287_g1_1376_t287_e1_history_followup
chk tier287_g1_1376_t287_e1_history_procedure
chk tier287_g1_1376_t287_e1_history_outcome
chk tier287_g2_1377_t287_e2_exam_assessment
chk tier287_g2_1377_t287_e2_exam_screening
chk tier287_g2_1377_t287_e2_exam_followup
chk tier287_g2_1377_t287_e2_exam_procedure
chk tier287_g2_1377_t287_e2_exam_outcome
chk tier287_g3_1378_t287_e3_orders_assessment
chk tier287_g3_1378_t287_e3_orders_screening
chk tier287_g3_1378_t287_e3_orders_followup
chk tier287_g3_1378_t287_e3_orders_procedure
chk tier287_g3_1378_t287_e3_orders_outcome
chk tier287_g4_1379_t287_e4_results_assessment
chk tier287_g4_1379_t287_e4_results_screening
chk tier287_g4_1379_t287_e4_results_followup
chk tier287_g4_1379_t287_e4_results_procedure
chk tier287_g4_1379_t287_e4_results_outcome
chk tier287_g5_1380_t287_e5_plan_assessment
chk tier287_g5_1380_t287_e5_plan_screening
chk tier287_g5_1380_t287_e5_plan_followup
chk tier287_g5_1380_t287_e5_plan_procedure
chk tier287_g5_1380_t287_e5_plan_outcome

echo "TOTALS: pass=$pass fail=$fail"
