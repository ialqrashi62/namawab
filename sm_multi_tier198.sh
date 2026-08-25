#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier198_re1_931_re1_initial_assessment
chk tier198_re1_931_re1_initial_screening
chk tier198_re1_931_re1_initial_followup
chk tier198_re1_931_re1_initial_procedure
chk tier198_re1_931_re1_initial_outcome
chk tier198_re2_932_re2_therapy_assessment
chk tier198_re2_932_re2_therapy_screening
chk tier198_re2_932_re2_therapy_followup
chk tier198_re2_932_re2_therapy_procedure
chk tier198_re2_932_re2_therapy_outcome
chk tier198_re3_933_re3_progress_assessment
chk tier198_re3_933_re3_progress_screening
chk tier198_re3_933_re3_progress_followup
chk tier198_re3_933_re3_progress_procedure
chk tier198_re3_933_re3_progress_outcome
chk tier198_re4_934_re4_outcome_assessment
chk tier198_re4_934_re4_outcome_screening
chk tier198_re4_934_re4_outcome_followup
chk tier198_re4_934_re4_outcome_procedure
chk tier198_re4_934_re4_outcome_outcome
chk tier198_re5_935_re5_discharge_assessment
chk tier198_re5_935_re5_discharge_screening
chk tier198_re5_935_re5_discharge_followup
chk tier198_re5_935_re5_discharge_procedure
chk tier198_re5_935_re5_discharge_outcome

echo "TOTALS: pass=$pass fail=$fail"
