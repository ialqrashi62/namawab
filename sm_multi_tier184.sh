#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier184_sx1_861_sx1_general_assessment
chk tier184_sx1_861_sx1_general_screening
chk tier184_sx1_861_sx1_general_followup
chk tier184_sx1_861_sx1_general_procedure
chk tier184_sx1_861_sx1_general_outcome
chk tier184_sx2_862_sx2_orthopedic_assessment
chk tier184_sx2_862_sx2_orthopedic_screening
chk tier184_sx2_862_sx2_orthopedic_followup
chk tier184_sx2_862_sx2_orthopedic_procedure
chk tier184_sx2_862_sx2_orthopedic_outcome
chk tier184_sx3_863_sx3_neuro_assessment
chk tier184_sx3_863_sx3_neuro_screening
chk tier184_sx3_863_sx3_neuro_followup
chk tier184_sx3_863_sx3_neuro_procedure
chk tier184_sx3_863_sx3_neuro_outcome
chk tier184_sx4_864_sx4_cardiothoracic_assessment
chk tier184_sx4_864_sx4_cardiothoracic_screening
chk tier184_sx4_864_sx4_cardiothoracic_followup
chk tier184_sx4_864_sx4_cardiothoracic_procedure
chk tier184_sx4_864_sx4_cardiothoracic_outcome
chk tier184_sx5_865_sx5_vascular_assessment
chk tier184_sx5_865_sx5_vascular_screening
chk tier184_sx5_865_sx5_vascular_followup
chk tier184_sx5_865_sx5_vascular_procedure
chk tier184_sx5_865_sx5_vascular_outcome

echo "TOTALS: pass=$pass fail=$fail"
