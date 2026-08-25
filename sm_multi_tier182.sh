#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier182_phl_851_phl_lab_assessment
chk tier182_phl_851_phl_lab_screening
chk tier182_phl_851_phl_lab_followup
chk tier182_phl_851_phl_lab_procedure
chk tier182_phl_851_phl_lab_outcome
chk tier182_phm_852_phm_microbiology_assessment
chk tier182_phm_852_phm_microbiology_screening
chk tier182_phm_852_phm_microbiology_followup
chk tier182_phm_852_phm_microbiology_procedure
chk tier182_phm_852_phm_microbiology_outcome
chk tier182_php_853_php_pathology_assessment
chk tier182_php_853_php_pathology_screening
chk tier182_php_853_php_pathology_followup
chk tier182_php_853_php_pathology_procedure
chk tier182_php_853_php_pathology_outcome
chk tier182_phb_854_phb_blood_bank_assessment
chk tier182_phb_854_phb_blood_bank_screening
chk tier182_phb_854_phb_blood_bank_followup
chk tier182_phb_854_phb_blood_bank_procedure
chk tier182_phb_854_phb_blood_bank_outcome
chk tier182_phg_855_phg_genetics_assessment
chk tier182_phg_855_phg_genetics_screening
chk tier182_phg_855_phg_genetics_followup
chk tier182_phg_855_phg_genetics_procedure
chk tier182_phg_855_phg_genetics_outcome

echo "TOTALS: pass=$pass fail=$fail"
