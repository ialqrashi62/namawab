#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier201_ch1_946_ch1_assess_assessment
chk tier201_ch1_946_ch1_assess_screening
chk tier201_ch1_946_ch1_assess_followup
chk tier201_ch1_946_ch1_assess_procedure
chk tier201_ch1_946_ch1_assess_outcome
chk tier201_ch2_947_ch2_plan_assessment
chk tier201_ch2_947_ch2_plan_screening
chk tier201_ch2_947_ch2_plan_followup
chk tier201_ch2_947_ch2_plan_procedure
chk tier201_ch2_947_ch2_plan_outcome
chk tier201_ch3_948_ch3_intervene_assessment
chk tier201_ch3_948_ch3_intervene_screening
chk tier201_ch3_948_ch3_intervene_followup
chk tier201_ch3_948_ch3_intervene_procedure
chk tier201_ch3_948_ch3_intervene_outcome
chk tier201_ch4_949_ch4_evaluate_assessment
chk tier201_ch4_949_ch4_evaluate_screening
chk tier201_ch4_949_ch4_evaluate_followup
chk tier201_ch4_949_ch4_evaluate_procedure
chk tier201_ch4_949_ch4_evaluate_outcome
chk tier201_ch5_950_ch5_discharge_assessment
chk tier201_ch5_950_ch5_discharge_screening
chk tier201_ch5_950_ch5_discharge_followup
chk tier201_ch5_950_ch5_discharge_procedure
chk tier201_ch5_950_ch5_discharge_outcome

echo "TOTALS: pass=$pass fail=$fail"
