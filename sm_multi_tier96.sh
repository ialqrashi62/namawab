#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/diabetes_t1dm_v2/t1dm_management|dt1_1"
  "1|/api/diabetes_t1dm_v2/insulin_pump|dt1_2"
  "2|/api/diabetes_t1dm_v2/cgm_review|dt1_3"
  "3|/api/diabetes_t1dm_v2/dka_management|dt1_4"
  "4|/api/diabetes_t1dm_v2/hypoglycemia|dt1_5"
  "5|/api/diabetes_t2dm_v2/t2dm_management|dt2_1"
  "6|/api/diabetes_t2dm_v2/oral_agents|dt2_2"
  "7|/api/diabetes_t2dm_v2/injectable_therapy|dt2_3"
  "8|/api/diabetes_t2dm_v2/diabetes_complications|dt2_4"
  "9|/api/diabetes_t2dm_v2/gestational_diabetes|dt2_5"
  "10|/api/thyroid_extended_v2/thyroid_nodule|th_1"
  "11|/api/thyroid_extended_v2/thyroid_cancer|th_2"
  "12|/api/thyroid_extended_v2/thyroid_surgery|th_3"
  "13|/api/thyroid_extended_v2/rai_therapy|th_4"
  "14|/api/thyroid_extended_v2/thyroid_eye|th_5"
  "15|/api/adrenal_pituitary_v2/adrenal_incidentaloma|ap_1"
  "16|/api/adrenal_pituitary_v2/pheochromocytoma|ap_2"
  "17|/api/adrenal_pituitary_v2/cushings|ap_3"
  "18|/api/adrenal_pituitary_v2/pituitary_adenoma|ap_4"
  "19|/api/adrenal_pituitary_v2/adrenal_insufficiency|ap_5"
  "20|/api/bone_metabolic_v2/osteoporosis_screening|bm_1"
  "21|/api/bone_metabolic_v2/osteoporosis_treatment|bm_2"
  "22|/api/bone_metabolic_v2/hyperparathyroidism|bm_3"
  "23|/api/bone_metabolic_v2/pagets|bm_4"
  "24|/api/bone_metabolic_v2/vitamin_d|bm_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
