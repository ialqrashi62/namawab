#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier195_qx1_916_qx1_indicator_assessment
chk tier195_qx1_916_qx1_indicator_screening
chk tier195_qx1_916_qx1_indicator_followup
chk tier195_qx1_916_qx1_indicator_procedure
chk tier195_qx1_916_qx1_indicator_outcome
chk tier195_qx2_917_qx2_measure_assessment
chk tier195_qx2_917_qx2_measure_screening
chk tier195_qx2_917_qx2_measure_followup
chk tier195_qx2_917_qx2_measure_procedure
chk tier195_qx2_917_qx2_measure_outcome
chk tier195_qx3_918_qx3_audit_assessment
chk tier195_qx3_918_qx3_audit_screening
chk tier195_qx3_918_qx3_audit_followup
chk tier195_qx3_918_qx3_audit_procedure
chk tier195_qx3_918_qx3_audit_outcome
chk tier195_qx4_919_qx4_review_assessment
chk tier195_qx4_919_qx4_review_screening
chk tier195_qx4_919_qx4_review_followup
chk tier195_qx4_919_qx4_review_procedure
chk tier195_qx4_919_qx4_review_outcome
chk tier195_qx5_920_qx5_improve_assessment
chk tier195_qx5_920_qx5_improve_screening
chk tier195_qx5_920_qx5_improve_followup
chk tier195_qx5_920_qx5_improve_procedure
chk tier195_qx5_920_qx5_improve_outcome

echo "TOTALS: pass=$pass fail=$fail"
