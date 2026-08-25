#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier191_rx1_896_rx1_dispense_assessment
chk tier191_rx1_896_rx1_dispense_screening
chk tier191_rx1_896_rx1_dispense_followup
chk tier191_rx1_896_rx1_dispense_procedure
chk tier191_rx1_896_rx1_dispense_outcome
chk tier191_rx2_897_rx2_interact_assessment
chk tier191_rx2_897_rx2_interact_screening
chk tier191_rx2_897_rx2_interact_followup
chk tier191_rx2_897_rx2_interact_procedure
chk tier191_rx2_897_rx2_interact_outcome
chk tier191_rx3_898_rx3_dose_assessment
chk tier191_rx3_898_rx3_dose_screening
chk tier191_rx3_898_rx3_dose_followup
chk tier191_rx3_898_rx3_dose_procedure
chk tier191_rx3_898_rx3_dose_outcome
chk tier191_rx4_899_rx4_refill_assessment
chk tier191_rx4_899_rx4_refill_screening
chk tier191_rx4_899_rx4_refill_followup
chk tier191_rx4_899_rx4_refill_procedure
chk tier191_rx4_899_rx4_refill_outcome
chk tier191_rx5_900_rx5_compound_assessment
chk tier191_rx5_900_rx5_compound_screening
chk tier191_rx5_900_rx5_compound_followup
chk tier191_rx5_900_rx5_compound_procedure
chk tier191_rx5_900_rx5_compound_outcome

echo "TOTALS: pass=$pass fail=$fail"
