#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/pt_extended_v2/manual_therapy|pt_0"
  "1|/api/pt_extended_v2/therapeutic_exercise|pt_1"
  "2|/api/pt_extended_v2/gait_analysis|pt_2"
  "3|/api/pt_extended_v2/aquatic_therapy|pt_3"
  "4|/api/pt_extended_v2/work_hardening|pt_4"
  "5|/api/ot_extended_v2/adl_training|ot_5"
  "6|/api/ot_extended_v2/splinting|ot_6"
  "7|/api/ot_extended_v2/assistive_tech|ot_7"
  "8|/api/ot_extended_v2/cognitive_rehab|ot_8"
  "9|/api/ot_extended_v2/work_rehab|ot_9"
  "10|/api/st_voice_v2/articulation|st_10"
  "11|/api/st_voice_v2/language_therapy|st_11"
  "12|/api/st_voice_v2/voice_therapy|st_12"
  "13|/api/st_voice_v2/cognitive_communication|st_13"
  "14|/api/st_voice_v2/dysphagia|st_14"
  "15|/api/rehab_engineering_v2/wheelchair_assessment|re_15"
  "16|/api/rehab_engineering_v2/orthotic_fitting|re_16"
  "17|/api/rehab_engineering_v2/prosthetic_assessment|re_17"
  "18|/api/rehab_engineering_v2/adaptive_equipment|re_18"
  "19|/api/rehab_engineering_v2/home_modifications|re_19"
  "20|/api/specialty_rehab_v2/neuro_rehab|sr_20"
  "21|/api/specialty_rehab_v2/cardiac_rehab_phase1|sr_21"
  "22|/api/specialty_rehab_v2/pulmonary_rehab|sr_22"
  "23|/api/specialty_rehab_v2/burn_rehab|sr_23"
  "24|/api/specialty_rehab_v2/lymphedema|sr_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"