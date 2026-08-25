#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier204_cp1_961_cp1_intake_assessment
chk tier204_cp1_961_cp1_intake_screening
chk tier204_cp1_961_cp1_intake_followup
chk tier204_cp1_961_cp1_intake_procedure
chk tier204_cp1_961_cp1_intake_outcome
chk tier204_cp2_962_cp2_assess_assessment
chk tier204_cp2_962_cp2_assess_screening
chk tier204_cp2_962_cp2_assess_followup
chk tier204_cp2_962_cp2_assess_procedure
chk tier204_cp2_962_cp2_assess_outcome
chk tier204_cp3_963_cp3_plan_assessment
chk tier204_cp3_963_cp3_plan_screening
chk tier204_cp3_963_cp3_plan_followup
chk tier204_cp3_963_cp3_plan_procedure
chk tier204_cp3_963_cp3_plan_outcome
chk tier204_cp4_964_cp4_intervene_assessment
chk tier204_cp4_964_cp4_intervene_screening
chk tier204_cp4_964_cp4_intervene_followup
chk tier204_cp4_964_cp4_intervene_procedure
chk tier204_cp4_964_cp4_intervene_outcome
chk tier204_cp5_965_cp5_review_assessment
chk tier204_cp5_965_cp5_review_screening
chk tier204_cp5_965_cp5_review_followup
chk tier204_cp5_965_cp5_review_procedure
chk tier204_cp5_965_cp5_review_outcome

echo "TOTALS: pass=$pass fail=$fail"
