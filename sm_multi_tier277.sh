#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier277_g1_1326_t277_e1_history_assessment
chk tier277_g1_1326_t277_e1_history_screening
chk tier277_g1_1326_t277_e1_history_followup
chk tier277_g1_1326_t277_e1_history_procedure
chk tier277_g1_1326_t277_e1_history_outcome
chk tier277_g2_1327_t277_e2_exam_assessment
chk tier277_g2_1327_t277_e2_exam_screening
chk tier277_g2_1327_t277_e2_exam_followup
chk tier277_g2_1327_t277_e2_exam_procedure
chk tier277_g2_1327_t277_e2_exam_outcome
chk tier277_g3_1328_t277_e3_orders_assessment
chk tier277_g3_1328_t277_e3_orders_screening
chk tier277_g3_1328_t277_e3_orders_followup
chk tier277_g3_1328_t277_e3_orders_procedure
chk tier277_g3_1328_t277_e3_orders_outcome
chk tier277_g4_1329_t277_e4_results_assessment
chk tier277_g4_1329_t277_e4_results_screening
chk tier277_g4_1329_t277_e4_results_followup
chk tier277_g4_1329_t277_e4_results_procedure
chk tier277_g4_1329_t277_e4_results_outcome
chk tier277_g5_1330_t277_e5_plan_assessment
chk tier277_g5_1330_t277_e5_plan_screening
chk tier277_g5_1330_t277_e5_plan_followup
chk tier277_g5_1330_t277_e5_plan_procedure
chk tier277_g5_1330_t277_e5_plan_outcome

echo "TOTALS: pass=$pass fail=$fail"
