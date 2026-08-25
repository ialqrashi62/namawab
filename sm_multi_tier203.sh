#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier203_sw1_956_sw1_screen_assessment
chk tier203_sw1_956_sw1_screen_screening
chk tier203_sw1_956_sw1_screen_followup
chk tier203_sw1_956_sw1_screen_procedure
chk tier203_sw1_956_sw1_screen_outcome
chk tier203_sw2_957_sw2_assess_assessment
chk tier203_sw2_957_sw2_assess_screening
chk tier203_sw2_957_sw2_assess_followup
chk tier203_sw2_957_sw2_assess_procedure
chk tier203_sw2_957_sw2_assess_outcome
chk tier203_sw3_958_sw3_plan_assessment
chk tier203_sw3_958_sw3_plan_screening
chk tier203_sw3_958_sw3_plan_followup
chk tier203_sw3_958_sw3_plan_procedure
chk tier203_sw3_958_sw3_plan_outcome
chk tier203_sw4_959_sw4_intervene_assessment
chk tier203_sw4_959_sw4_intervene_screening
chk tier203_sw4_959_sw4_intervene_followup
chk tier203_sw4_959_sw4_intervene_procedure
chk tier203_sw4_959_sw4_intervene_outcome
chk tier203_sw5_960_sw5_close_assessment
chk tier203_sw5_960_sw5_close_screening
chk tier203_sw5_960_sw5_close_followup
chk tier203_sw5_960_sw5_close_procedure
chk tier203_sw5_960_sw5_close_outcome

echo "TOTALS: pass=$pass fail=$fail"
