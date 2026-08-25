#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier192_lx1_901_lx1_collect_assessment
chk tier192_lx1_901_lx1_collect_screening
chk tier192_lx1_901_lx1_collect_followup
chk tier192_lx1_901_lx1_collect_procedure
chk tier192_lx1_901_lx1_collect_outcome
chk tier192_lx2_902_lx2_process_assessment
chk tier192_lx2_902_lx2_process_screening
chk tier192_lx2_902_lx2_process_followup
chk tier192_lx2_902_lx2_process_procedure
chk tier192_lx2_902_lx2_process_outcome
chk tier192_lx3_903_lx3_analyze_assessment
chk tier192_lx3_903_lx3_analyze_screening
chk tier192_lx3_903_lx3_analyze_followup
chk tier192_lx3_903_lx3_analyze_procedure
chk tier192_lx3_903_lx3_analyze_outcome
chk tier192_lx4_904_lx4_result_assessment
chk tier192_lx4_904_lx4_result_screening
chk tier192_lx4_904_lx4_result_followup
chk tier192_lx4_904_lx4_result_procedure
chk tier192_lx4_904_lx4_result_outcome
chk tier192_lx5_905_lx5_qc_assessment
chk tier192_lx5_905_lx5_qc_screening
chk tier192_lx5_905_lx5_qc_followup
chk tier192_lx5_905_lx5_qc_procedure
chk tier192_lx5_905_lx5_qc_outcome

echo "TOTALS: pass=$pass fail=$fail"
