#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier217_b1_1026_t217_e1_pre_assessment
chk tier217_b1_1026_t217_e1_pre_screening
chk tier217_b1_1026_t217_e1_pre_followup
chk tier217_b1_1026_t217_e1_pre_procedure
chk tier217_b1_1026_t217_e1_pre_outcome
chk tier217_b2_1027_t217_e2_intra_assessment
chk tier217_b2_1027_t217_e2_intra_screening
chk tier217_b2_1027_t217_e2_intra_followup
chk tier217_b2_1027_t217_e2_intra_procedure
chk tier217_b2_1027_t217_e2_intra_outcome
chk tier217_b3_1028_t217_e3_post_assessment
chk tier217_b3_1028_t217_e3_post_screening
chk tier217_b3_1028_t217_e3_post_followup
chk tier217_b3_1028_t217_e3_post_procedure
chk tier217_b3_1028_t217_e3_post_outcome
chk tier217_b4_1029_t217_e4_follow_assessment
chk tier217_b4_1029_t217_e4_follow_screening
chk tier217_b4_1029_t217_e4_follow_followup
chk tier217_b4_1029_t217_e4_follow_procedure
chk tier217_b4_1029_t217_e4_follow_outcome
chk tier217_b5_1030_t217_e5_discharge_assessment
chk tier217_b5_1030_t217_e5_discharge_screening
chk tier217_b5_1030_t217_e5_discharge_followup
chk tier217_b5_1030_t217_e5_discharge_procedure
chk tier217_b5_1030_t217_e5_discharge_outcome

echo "TOTALS: pass=$pass fail=$fail"
