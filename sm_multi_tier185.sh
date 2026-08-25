#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier185_rx1_866_rx1_cardiology_assessment
chk tier185_rx1_866_rx1_cardiology_screening
chk tier185_rx1_866_rx1_cardiology_followup
chk tier185_rx1_866_rx1_cardiology_procedure
chk tier185_rx1_866_rx1_cardiology_outcome
chk tier185_rx2_867_rx2_oncology_assessment
chk tier185_rx2_867_rx2_oncology_screening
chk tier185_rx2_867_rx2_oncology_followup
chk tier185_rx2_867_rx2_oncology_procedure
chk tier185_rx2_867_rx2_oncology_outcome
chk tier185_rx3_868_rx3_pulmonology_assessment
chk tier185_rx3_868_rx3_pulmonology_screening
chk tier185_rx3_868_rx3_pulmonology_followup
chk tier185_rx3_868_rx3_pulmonology_procedure
chk tier185_rx3_868_rx3_pulmonology_outcome
chk tier185_rx4_869_rx4_endocrinology_assessment
chk tier185_rx4_869_rx4_endocrinology_screening
chk tier185_rx4_869_rx4_endocrinology_followup
chk tier185_rx4_869_rx4_endocrinology_procedure
chk tier185_rx4_869_rx4_endocrinology_outcome
chk tier185_rx5_870_rx5_nephrology_assessment
chk tier185_rx5_870_rx5_nephrology_screening
chk tier185_rx5_870_rx5_nephrology_followup
chk tier185_rx5_870_rx5_nephrology_procedure
chk tier185_rx5_870_rx5_nephrology_outcome

echo "TOTALS: pass=$pass fail=$fail"
