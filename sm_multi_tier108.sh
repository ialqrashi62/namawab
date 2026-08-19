#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/ct_advanced_v2/ct_cardiac|ct_0"
  "1|/api/ct_advanced_v2/ct_pulmonary_angiogram|ct_1"
  "2|/api/ct_advanced_v2/ct_perfusion|ct_2"
  "3|/api/ct_advanced_v2/ct_enterography|ct_3"
  "4|/api/ct_advanced_v2/ct_virtual_colonoscopy|ct_4"
  "5|/api/mri_advanced_v2/mri_brain|mr_5"
  "6|/api/mri_advanced_v2/mri_spine|mr_6"
  "7|/api/mri_advanced_v2/functional_mri|mr_7"
  "8|/api/mri_advanced_v2/mr_angiography|mr_8"
  "9|/api/mri_advanced_v2/mr_spectroscopy|mr_9"
  "10|/api/ultrasound_advanced_v2/echo_complete|us_10"
  "11|/api/ultrasound_advanced_v2/vascular_duplex|us_11"
  "12|/api/ultrasound_advanced_v2/point_of_care_us|us_12"
  "13|/api/ultrasound_advanced_v2/elastography|us_13"
  "14|/api/ultrasound_advanced_v2/contrast_echo|us_14"
  "15|/api/imaging_ai_v2/ai_detection|ai_15"
  "16|/api/imaging_ai_v2/image_segmentation|ai_16"
  "17|/api/imaging_ai_v2/classification|ai_17"
  "18|/api/imaging_ai_v2/computer_aided_diagnosis|ai_18"
  "19|/api/imaging_ai_v2/radiomics|ai_19"
  "20|/api/imaging_quality_v2/accreditation|iq_20"
  "21|/api/imaging_quality_v2/dose_monitoring|iq_21"
  "22|/api/imaging_quality_v2/image_quality|iq_22"
  "23|/api/imaging_quality_v2/report_turnaround|iq_23"
  "24|/api/imaging_quality_v2/peer_review|iq_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"