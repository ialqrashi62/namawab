#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier179_uro_836_uro_specialty_assessment
chk tier179_uro_836_uro_specialty_screening
chk tier179_uro_836_uro_specialty_followup
chk tier179_uro_836_uro_specialty_procedure
chk tier179_uro_836_uro_specialty_outcome
chk tier179_nep_837_neph_specialty_assessment
chk tier179_nep_837_neph_specialty_screening
chk tier179_nep_837_neph_specialty_followup
chk tier179_nep_837_neph_specialty_procedure
chk tier179_nep_837_neph_specialty_outcome
chk tier179_pul_838_pul_specialty_assessment
chk tier179_pul_838_pul_specialty_screening
chk tier179_pul_838_pul_specialty_followup
chk tier179_pul_838_pul_specialty_procedure
chk tier179_pul_838_pul_specialty_outcome
chk tier179_sle_839_sleep_specialty_assessment
chk tier179_sle_839_sleep_specialty_screening
chk tier179_sle_839_sleep_specialty_followup
chk tier179_sle_839_sleep_specialty_procedure
chk tier179_sle_839_sleep_specialty_outcome
chk tier179_all_840_allergy_specialty_assessment
chk tier179_all_840_allergy_specialty_screening
chk tier179_all_840_allergy_specialty_followup
chk tier179_all_840_allergy_specialty_procedure
chk tier179_all_840_allergy_specialty_outcome

echo "TOTALS: pass=$pass fail=$fail"
