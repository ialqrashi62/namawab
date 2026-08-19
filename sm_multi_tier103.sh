#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/pathology_v2/histology_review|pa_1"
  "1|/api/pathology_v2/cytology|pa_2"
  "2|/api/pathology_v2/frozen_section|pa_3"
  "3|/api/pathology_v2/molecular_path|pa_4"
  "4|/api/pathology_v2/autopsy|pa_5"
  "5|/api/radiology_extended_v2/ct_protocol|re_1"
  "6|/api/radiology_extended_v2/mri_protocol|re_2"
  "7|/api/radiology_extended_v2/interventional_radiology|re_3"
  "8|/api/radiology_extended_v2/contrast_reaction|re_4"
  "9|/api/radiology_extended_v2/image_guided_biopsy|re_5"
  "10|/api/nuclear_medicine_v2/pet_ct|nm_1"
  "11|/api/nuclear_medicine_v2/bone_scan|nm_2"
  "12|/api/nuclear_medicine_v2/thyroid_scan|nm_3"
  "13|/api/nuclear_medicine_v2/myocardial_perfusion|nm_4"
  "14|/api/nuclear_medicine_v2/therapy_radionuclide|nm_5"
  "15|/api/lab_management_v2/specimen_collection|lm_1"
  "16|/api/lab_management_v2/critical_value|lm_2"
  "17|/api/lab_management_v2/lab_quality|lm_3"
  "18|/api/lab_management_v2/turn_around_time|lm_4"
  "19|/api/lab_management_v2/lab_error|lm_5"
  "20|/api/blood_bank_v2/type_and_cross|bb_1"
  "21|/api/blood_bank_v2/transfusion_reaction|bb_2"
  "22|/api/blood_bank_v2/plasma_exchange|bb_3"
  "23|/api/blood_bank_v2/platelet_transfusion|bb_4"
  "24|/api/blood_bank_v2/autologous_donation|bb_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
