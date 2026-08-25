#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier196_sx1_921_sx1_consult_assessment
chk tier196_sx1_921_sx1_consult_screening
chk tier196_sx1_921_sx1_consult_followup
chk tier196_sx1_921_sx1_consult_procedure
chk tier196_sx1_921_sx1_consult_outcome
chk tier196_sx2_922_sx2_assess_assessment
chk tier196_sx2_922_sx2_assess_screening
chk tier196_sx2_922_sx2_assess_followup
chk tier196_sx2_922_sx2_assess_procedure
chk tier196_sx2_922_sx2_assess_outcome
chk tier196_sx3_923_sx3_plan_assessment
chk tier196_sx3_923_sx3_plan_screening
chk tier196_sx3_923_sx3_plan_followup
chk tier196_sx3_923_sx3_plan_procedure
chk tier196_sx3_923_sx3_plan_outcome
chk tier196_sx4_924_sx4_execute_assessment
chk tier196_sx4_924_sx4_execute_screening
chk tier196_sx4_924_sx4_execute_followup
chk tier196_sx4_924_sx4_execute_procedure
chk tier196_sx4_924_sx4_execute_outcome
chk tier196_sx5_925_sx5_review_assessment
chk tier196_sx5_925_sx5_review_screening
chk tier196_sx5_925_sx5_review_followup
chk tier196_sx5_925_sx5_review_procedure
chk tier196_sx5_925_sx5_review_outcome

echo "TOTALS: pass=$pass fail=$fail"
