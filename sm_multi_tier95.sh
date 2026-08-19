#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/hepatology_viral_v2/hcv_assessment|hv_1"
  "1|/api/hepatology_viral_v2/hcv_treatment|hv_2"
  "2|/api/hepatology_viral_v2/hbv_assessment|hv_3"
  "3|/api/hepatology_viral_v2/hbv_treatment|hv_4"
  "4|/api/hepatology_viral_v2/hepatitis_vaccination|hv_5"
  "5|/api/hepatology_cirrhosis_v2/cirrhosis_assessment|hc_1"
  "6|/api/hepatology_cirrhosis_v2/ascites_management|hc_2"
  "7|/api/hepatology_cirrhosis_v2/hepatic_encephalopathy|hc_3"
  "8|/api/hepatology_cirrhosis_v2/spontaneous_bacterial_peritonitis|hc_4"
  "9|/api/hepatology_cirrhosis_v2/variceal_bleeding|hc_5"
  "10|/api/hepatology_liver_failure_v2/acute_liver_failure|hlf_1"
  "11|/api/hepatology_liver_failure_v2/decompensated_cirrhosis|hlf_2"
  "12|/api/hepatology_liver_failure_v2/transplant_evaluation|hlf_3"
  "13|/api/hepatology_liver_failure_v2/transplant_followup|hlf_4"
  "14|/api/hepatology_liver_failure_v2/liver_cancer|hlf_5"
  "15|/api/hepatology_pediatric_v2/neonatal_hepatitis|hped_1"
  "16|/api/hepatology_pediatric_v2/biliary_atresia|hped_2"
  "17|/api/hepatology_pediatric_v2/pediatric_liver_transplant|hped_3"
  "18|/api/hepatology_pediatric_v2/pediatric_pf_icp|hped_4"
  "19|/api/hepatology_pediatric_v2/alpha_1_antitrypsin|hped_5"
  "20|/api/hepatology_metabolic_v2/nafld_assessment|hm_1"
  "21|/api/hepatology_metabolic_v2/nash_treatment|hm_2"
  "22|/api/hepatology_metabolic_v2/wilson_disease|hm_3"
  "23|/api/hepatology_metabolic_v2/hemochromatosis|hm_4"
  "24|/api/hepatology_metabolic_v2/autoimmune_hepatitis|hm_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
