#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier177_ort_826_ortho_specialty_assessment
chk tier177_ort_826_ortho_specialty_screening
chk tier177_ort_826_ortho_specialty_followup
chk tier177_ort_826_ortho_specialty_procedure
chk tier177_ort_826_ortho_specialty_outcome
chk tier177_ent_827_ent_specialty_assessment
chk tier177_ent_827_ent_specialty_screening
chk tier177_ent_827_ent_specialty_followup
chk tier177_ent_827_ent_specialty_procedure
chk tier177_ent_827_ent_specialty_outcome
chk tier177_eye_828_eye_specialty_assessment
chk tier177_eye_828_eye_specialty_screening
chk tier177_eye_828_eye_specialty_followup
chk tier177_eye_828_eye_specialty_procedure
chk tier177_eye_828_eye_specialty_outcome
chk tier177_der_829_derm_specialty_assessment
chk tier177_der_829_derm_specialty_screening
chk tier177_der_829_derm_specialty_followup
chk tier177_der_829_derm_specialty_procedure
chk tier177_der_829_derm_specialty_outcome
chk tier177_rhe_830_rheum_specialty_assessment
chk tier177_rhe_830_rheum_specialty_screening
chk tier177_rhe_830_rheum_specialty_followup
chk tier177_rhe_830_rheum_specialty_procedure
chk tier177_rhe_830_rheum_specialty_outcome

echo "TOTALS: pass=$pass fail=$fail"
