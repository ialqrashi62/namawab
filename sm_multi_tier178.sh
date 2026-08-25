#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier178_gi_831_gi_specialty_assessment
chk tier178_gi_831_gi_specialty_screening
chk tier178_gi_831_gi_specialty_followup
chk tier178_gi_831_gi_specialty_procedure
chk tier178_gi_831_gi_specialty_outcome
chk tier178_end_832_endo_specialty_assessment
chk tier178_end_832_endo_specialty_screening
chk tier178_end_832_endo_specialty_followup
chk tier178_end_832_endo_specialty_procedure
chk tier178_end_832_endo_specialty_outcome
chk tier178_neu_833_neuro_specialty_assessment
chk tier178_neu_833_neuro_specialty_screening
chk tier178_neu_833_neuro_specialty_followup
chk tier178_neu_833_neuro_specialty_procedure
chk tier178_neu_833_neuro_specialty_outcome
chk tier178_psy_834_psych_specialty_assessment
chk tier178_psy_834_psych_specialty_screening
chk tier178_psy_834_psych_specialty_followup
chk tier178_psy_834_psych_specialty_procedure
chk tier178_psy_834_psych_specialty_outcome
chk tier178_pal_835_pain_specialty_assessment
chk tier178_pal_835_pain_specialty_screening
chk tier178_pal_835_pain_specialty_followup
chk tier178_pal_835_pain_specialty_procedure
chk tier178_pal_835_pain_specialty_outcome

echo "TOTALS: pass=$pass fail=$fail"
