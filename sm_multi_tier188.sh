#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier188_wh1_881_wh1_history_assessment
chk tier188_wh1_881_wh1_history_screening
chk tier188_wh1_881_wh1_history_followup
chk tier188_wh1_881_wh1_history_procedure
chk tier188_wh1_881_wh1_history_outcome
chk tier188_wh2_882_wh2_exam_assessment
chk tier188_wh2_882_wh2_exam_screening
chk tier188_wh2_882_wh2_exam_followup
chk tier188_wh2_882_wh2_exam_procedure
chk tier188_wh2_882_wh2_exam_outcome
chk tier188_wh3_883_wh3_orders_assessment
chk tier188_wh3_883_wh3_orders_screening
chk tier188_wh3_883_wh3_orders_followup
chk tier188_wh3_883_wh3_orders_procedure
chk tier188_wh3_883_wh3_orders_outcome
chk tier188_wh4_884_wh4_results_assessment
chk tier188_wh4_884_wh4_results_screening
chk tier188_wh4_884_wh4_results_followup
chk tier188_wh4_884_wh4_results_procedure
chk tier188_wh4_884_wh4_results_outcome
chk tier188_wh5_885_wh5_plan_assessment
chk tier188_wh5_885_wh5_plan_screening
chk tier188_wh5_885_wh5_plan_followup
chk tier188_wh5_885_wh5_plan_procedure
chk tier188_wh5_885_wh5_plan_outcome

echo "TOTALS: pass=$pass fail=$fail"
