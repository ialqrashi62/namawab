#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/id_general_v2/id_clinic|ig_c"
  "1|/api/id_general_v2/fever_workup|ig_f"
  "2|/api/id_general_v2/sepsis|ig_s"
  "3|/api/id_general_v2/tb|ig_t"
  "4|/api/id_general_v2/hiv_visit|ig_h"
  "5|/api/id_syndromes_v2/endocarditis|is_e"
  "6|/api/id_syndromes_v2/meningitis|is_m"
  "7|/api/id_syndromes_v2/osteomyelitis|is_o"
  "8|/api/id_syndromes_v2/skin_infection|is_s"
  "9|/api/id_syndromes_v2/uti_id|is_u"
  "10|/api/gi_luminal_v2/endoscopy|glu_e"
  "11|/api/gi_luminal_v2/colonoscopy|glu_c"
  "12|/api/gi_luminal_v2/ercp|glu_er"
  "13|/api/gi_luminal_v2/ercp_therapeutic|glu_et"
  "14|/api/gi_luminal_v2/capsule_endoscopy|glu_cap"
  "15|/api/gi_liver_v2/hepatitis_clinic_gi|gli_h"
  "16|/api/gi_liver_v2/cirrhosis|gli_c"
  "17|/api/gi_liver_v2/liver_mass|gli_lm"
  "18|/api/gi_liver_v2/liver_transplant|gli_lt"
  "19|/api/gi_liver_v2/portal_htn|gli_ph"
  "20|/api/id_specialty_v2/hiv_specialist|idp_h"
  "21|/api/id_specialty_v2/hepatitis_clinic|idp_he"
  "22|/api/id_specialty_v2/travel_medicine|idp_t"
  "23|/api/id_specialty_v2/fever_unknown_origin|idp_f"
  "24|/api/id_specialty_v2/antimicrobial_stewardship|idp_a"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
