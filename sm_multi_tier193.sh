#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier193_dx1_906_dx1_screen_assessment
chk tier193_dx1_906_dx1_screen_screening
chk tier193_dx1_906_dx1_screen_followup
chk tier193_dx1_906_dx1_screen_procedure
chk tier193_dx1_906_dx1_screen_outcome
chk tier193_dx2_907_dx2_confirm_assessment
chk tier193_dx2_907_dx2_confirm_screening
chk tier193_dx2_907_dx2_confirm_followup
chk tier193_dx2_907_dx2_confirm_procedure
chk tier193_dx2_907_dx2_confirm_outcome
chk tier193_dx3_908_dx3_stage_assessment
chk tier193_dx3_908_dx3_stage_screening
chk tier193_dx3_908_dx3_stage_followup
chk tier193_dx3_908_dx3_stage_procedure
chk tier193_dx3_908_dx3_stage_outcome
chk tier193_dx4_909_dx4_grade_assessment
chk tier193_dx4_909_dx4_grade_screening
chk tier193_dx4_909_dx4_grade_followup
chk tier193_dx4_909_dx4_grade_procedure
chk tier193_dx4_909_dx4_grade_outcome
chk tier193_dx5_910_dx5_followup_assessment
chk tier193_dx5_910_dx5_followup_screening
chk tier193_dx5_910_dx5_followup_followup
chk tier193_dx5_910_dx5_followup_procedure
chk tier193_dx5_910_dx5_followup_outcome

echo "TOTALS: pass=$pass fail=$fail"
