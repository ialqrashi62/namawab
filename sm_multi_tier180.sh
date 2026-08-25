#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier180_obg_841_obgyn_specialty_assessment
chk tier180_obg_841_obgyn_specialty_screening
chk tier180_obg_841_obgyn_specialty_followup
chk tier180_obg_841_obgyn_specialty_procedure
chk tier180_obg_841_obgyn_specialty_outcome
chk tier180_ped_842_peds_specialty_assessment
chk tier180_ped_842_peds_specialty_screening
chk tier180_ped_842_peds_specialty_followup
chk tier180_ped_842_peds_specialty_procedure
chk tier180_ped_842_peds_specialty_outcome
chk tier180_gen_843_genmed_specialty_assessment
chk tier180_gen_843_genmed_specialty_screening
chk tier180_gen_843_genmed_specialty_followup
chk tier180_gen_843_genmed_specialty_procedure
chk tier180_gen_843_genmed_specialty_outcome
chk tier180_sur_844_surgery_specialty_assessment
chk tier180_sur_844_surgery_specialty_screening
chk tier180_sur_844_surgery_specialty_followup
chk tier180_sur_844_surgery_specialty_procedure
chk tier180_sur_844_surgery_specialty_outcome
chk tier180_eme_845_emergency_specialty_assessment
chk tier180_eme_845_emergency_specialty_screening
chk tier180_eme_845_emergency_specialty_followup
chk tier180_eme_845_emergency_specialty_procedure
chk tier180_eme_845_emergency_specialty_outcome

echo "TOTALS: pass=$pass fail=$fail"
