#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier232_b1_1101_t232_e1_pre_assessment
chk tier232_b1_1101_t232_e1_pre_screening
chk tier232_b1_1101_t232_e1_pre_followup
chk tier232_b1_1101_t232_e1_pre_procedure
chk tier232_b1_1101_t232_e1_pre_outcome
chk tier232_b2_1102_t232_e2_intra_assessment
chk tier232_b2_1102_t232_e2_intra_screening
chk tier232_b2_1102_t232_e2_intra_followup
chk tier232_b2_1102_t232_e2_intra_procedure
chk tier232_b2_1102_t232_e2_intra_outcome
chk tier232_b3_1103_t232_e3_post_assessment
chk tier232_b3_1103_t232_e3_post_screening
chk tier232_b3_1103_t232_e3_post_followup
chk tier232_b3_1103_t232_e3_post_procedure
chk tier232_b3_1103_t232_e3_post_outcome
chk tier232_b4_1104_t232_e4_follow_assessment
chk tier232_b4_1104_t232_e4_follow_screening
chk tier232_b4_1104_t232_e4_follow_followup
chk tier232_b4_1104_t232_e4_follow_procedure
chk tier232_b4_1104_t232_e4_follow_outcome
chk tier232_b5_1105_t232_e5_discharge_assessment
chk tier232_b5_1105_t232_e5_discharge_screening
chk tier232_b5_1105_t232_e5_discharge_followup
chk tier232_b5_1105_t232_e5_discharge_procedure
chk tier232_b5_1105_t232_e5_discharge_outcome

echo "TOTALS: pass=$pass fail=$fail"
