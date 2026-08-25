#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier176_car_821_cardiac_rehab_advanced_assessment
chk tier176_car_821_cardiac_rehab_advanced_screening
chk tier176_car_821_cardiac_rehab_advanced_followup
chk tier176_car_821_cardiac_rehab_advanced_procedure
chk tier176_car_821_cardiac_rehab_advanced_outcome
chk tier176_onc_822_oncology_advanced_assessment
chk tier176_onc_822_oncology_advanced_screening
chk tier176_onc_822_oncology_advanced_followup
chk tier176_onc_822_oncology_advanced_procedure
chk tier176_onc_822_oncology_advanced_outcome
chk tier176_emr_823_emergency_critical_assessment
chk tier176_emr_823_emergency_critical_screening
chk tier176_emr_823_emergency_critical_followup
chk tier176_emr_823_emergency_critical_procedure
chk tier176_emr_823_emergency_critical_outcome
chk tier176_lab_824_lab_specialty_assessment
chk tier176_lab_824_lab_specialty_screening
chk tier176_lab_824_lab_specialty_followup
chk tier176_lab_824_lab_specialty_procedure
chk tier176_lab_824_lab_specialty_outcome
chk tier176_rad_825_radiology_specialty_assessment
chk tier176_rad_825_radiology_specialty_screening
chk tier176_rad_825_radiology_specialty_followup
chk tier176_rad_825_radiology_specialty_procedure
chk tier176_rad_825_radiology_specialty_outcome

echo "TOTALS: pass=$pass fail=$fail"
