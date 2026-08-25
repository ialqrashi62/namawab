#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier265_e1_1266_t265_e1_intake_assessment
chk tier265_e1_1266_t265_e1_intake_screening
chk tier265_e1_1266_t265_e1_intake_followup
chk tier265_e1_1266_t265_e1_intake_procedure
chk tier265_e1_1266_t265_e1_intake_outcome
chk tier265_e2_1267_t265_e2_exam_assessment
chk tier265_e2_1267_t265_e2_exam_screening
chk tier265_e2_1267_t265_e2_exam_followup
chk tier265_e2_1267_t265_e2_exam_procedure
chk tier265_e2_1267_t265_e2_exam_outcome
chk tier265_e3_1268_t265_e3_plan_assessment
chk tier265_e3_1268_t265_e3_plan_screening
chk tier265_e3_1268_t265_e3_plan_followup
chk tier265_e3_1268_t265_e3_plan_procedure
chk tier265_e3_1268_t265_e3_plan_outcome
chk tier265_e4_1269_t265_e4_execute_assessment
chk tier265_e4_1269_t265_e4_execute_screening
chk tier265_e4_1269_t265_e4_execute_followup
chk tier265_e4_1269_t265_e4_execute_procedure
chk tier265_e4_1269_t265_e4_execute_outcome
chk tier265_e5_1270_t265_e5_review_assessment
chk tier265_e5_1270_t265_e5_review_screening
chk tier265_e5_1270_t265_e5_review_followup
chk tier265_e5_1270_t265_e5_review_procedure
chk tier265_e5_1270_t265_e5_review_outcome

echo "TOTALS: pass=$pass fail=$fail"
