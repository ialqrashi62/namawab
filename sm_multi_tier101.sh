#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/peds_neonatal_v2/nicu_admission|n_1"
  "1|/api/peds_neonatal_v2/respiratory_distress|n_2"
  "2|/api/peds_neonatal_v2/neonatal_sepsis|n_3"
  "3|/api/peds_neonatal_v2/feeding_growth|n_4"
  "4|/api/peds_neonatal_v2/neonatal_jaundice|n_5"
  "5|/api/peds_picu_v2/picu_admission|p_1"
  "6|/api/peds_picu_v2/peds_septic_shock|p_2"
  "7|/api/peds_picu_v2/status_asthmaticus|p_3"
  "8|/api/peds_picu_v2/dka_pediatric|p_4"
  "9|/api/peds_picu_v2/status_epilepticus|p_5"
  "10|/api/peds_cardiology_v2/congenital_heart_disease|pc_1"
  "11|/api/peds_cardiology_v2/echocardiogram_peds|pc_2"
  "12|/api/peds_cardiology_v2/fetal_echo|pc_3"
  "13|/api/peds_cardiology_v2/peds_arrhythmia|pc_4"
  "14|/api/peds_cardiology_v2/chd_followup|pc_5"
  "15|/api/peds_pulmonology_v2/asthma_peds|pp_1"
  "16|/api/peds_pulmonology_v2/cf_followup|pp_2"
  "17|/api/peds_pulmonology_v2/bronchopulmonary_dysplasia|pp_3"
  "18|/api/peds_pulmonology_v2/sleep_peds|pp_4"
  "19|/api/peds_pulmonology_v2/peds_bronchoscopy|pp_5"
  "20|/api/peds_development_v2/developmental_screening|pd_1"
  "21|/api/peds_development_v2/autism_screening|pd_2"
  "22|/api/peds_development_v2/learning_disability|pd_3"
  "23|/api/peds_development_v2/adhd_assessment|pd_4"
  "24|/api/peds_development_v2/behavioral_assessment|pd_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
