#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier197_mh1_926_mh1_intake_assessment
chk tier197_mh1_926_mh1_intake_screening
chk tier197_mh1_926_mh1_intake_followup
chk tier197_mh1_926_mh1_intake_procedure
chk tier197_mh1_926_mh1_intake_outcome
chk tier197_mh2_927_mh2_assess_assessment
chk tier197_mh2_927_mh2_assess_screening
chk tier197_mh2_927_mh2_assess_followup
chk tier197_mh2_927_mh2_assess_procedure
chk tier197_mh2_927_mh2_assess_outcome
chk tier197_mh3_928_mh3_therapy_assessment
chk tier197_mh3_928_mh3_therapy_screening
chk tier197_mh3_928_mh3_therapy_followup
chk tier197_mh3_928_mh3_therapy_procedure
chk tier197_mh3_928_mh3_therapy_outcome
chk tier197_mh4_929_mh4_meds_assessment
chk tier197_mh4_929_mh4_meds_screening
chk tier197_mh4_929_mh4_meds_followup
chk tier197_mh4_929_mh4_meds_procedure
chk tier197_mh4_929_mh4_meds_outcome
chk tier197_mh5_930_mh5_outcome_assessment
chk tier197_mh5_930_mh5_outcome_screening
chk tier197_mh5_930_mh5_outcome_followup
chk tier197_mh5_930_mh5_outcome_procedure
chk tier197_mh5_930_mh5_outcome_outcome

echo "TOTALS: pass=$pass fail=$fail"
