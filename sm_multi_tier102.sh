#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/surg_general_v2/hernia_repair|sg_1"
  "1|/api/surg_general_v2/cholecystectomy|sg_2"
  "2|/api/surg_general_v2/appendectomy|sg_3"
  "3|/api/surg_general_v2/bowel_resection|sg_4"
  "4|/api/surg_general_v2/soft_tissue|sg_5"
  "5|/api/surg_oncology_v2/cancer_staging|so_1"
  "6|/api/surg_oncology_v2/tumor_resection|so_2"
  "7|/api/surg_oncology_v2/lymph_node_dissection|so_3"
  "8|/api/surg_oncology_v2/recurrent_cancer|so_4"
  "9|/api/surg_oncology_v2/palliative_surgery|so_5"
  "10|/api/surg_vascular_v2/aaa_repair|sv_1"
  "11|/api/surg_vascular_v2/carotid_endarterectomy|sv_2"
  "12|/api/surg_vascular_v2/bypass_graft|sv_3"
  "13|/api/surg_vascular_v2/varicose_veins|sv_4"
  "14|/api/surg_vascular_v2/dvt_treatment|sv_5"
  "15|/api/surg_trauma_v2/trauma_assessment|str_1"
  "16|/api/surg_trauma_v2/damage_control|str_2"
  "17|/api/surg_trauma_v2/resuscitation|str_3"
  "18|/api/surg_trauma_v2/penetrating_trauma|str_4"
  "19|/api/surg_trauma_v2/blunt_trauma|str_5"
  "20|/api/surg_transplant_v2/transplant_evaluation|stx_1"
  "21|/api/surg_transplant_v2/transplant_surgery|stx_2"
  "22|/api/surg_transplant_v2/post_transplant|stx_3"
  "23|/api/surg_transplant_v2/donor_workup|stx_4"
  "24|/api/surg_transplant_v2/immunosuppression|stx_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
