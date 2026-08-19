#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/immunodeficiency_v2/primary_immunodeficiency|imm_1"
  "1|/api/immunodeficiency_v2/hiv_care|imm_2"
  "2|/api/immunodeficiency_v2/immunoglobulin_replacement|imm_3"
  "3|/api/immunodeficiency_v2/vaccine_immunodeficiency|imm_4"
  "4|/api/immunodeficiency_v2/autoimmune_screening|imm_5"
  "5|/api/allergy_clinical_v2/allergic_rhinitis|alc_1"
  "6|/api/allergy_clinical_v2/asthma_management|alc_2"
  "7|/api/allergy_clinical_v2/food_allergy|alc_3"
  "8|/api/allergy_clinical_v2/drug_allergy|alc_4"
  "9|/api/allergy_clinical_v2/anaphylaxis|alc_5"
  "10|/api/immunology_lab_v2/allergy_testing|ill_1"
  "11|/api/immunology_lab_v2/lymphocyte_subsets|ill_2"
  "12|/api/immunology_lab_v2/complement_levels|ill_3"
  "13|/api/immunology_lab_v2/cytokine_panel|ill_4"
  "14|/api/immunology_lab_v2/neutrophil_function|ill_5"
  "15|/api/immunotherapy_v2/allergen_immunotherapy|it_1"
  "16|/api/immunotherapy_v2/biologic_therapy|it_2"
  "17|/api/immunotherapy_v2/oral_immunotherapy|it_3"
  "18|/api/immunotherapy_v2/desensitization|it_4"
  "19|/api/immunotherapy_v2/immunosuppression|it_5"
  "20|/api/autoimmune_v2/autoimmune_assessment|au_1"
  "21|/api/autoimmune_v2/lupus_disease_activity|au_2"
  "22|/api/autoimmune_v2/autoimmune_arthritis|au_3"
  "23|/api/autoimmune_v2/vasculitis_assessment|au_4"
  "24|/api/autoimmune_v2/connective_tissue|au_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
