#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/cardio_acute_v2/stemi|ca_1"
  "1|/api/cardio_acute_v2/nstemi|ca_2"
  "2|/api/cardio_acute_v2/heart_failure|ca_3"
  "3|/api/cardio_acute_v2/cardiogenic_shock|ca_4"
  "4|/api/cardio_acute_v2/arrhythmia_acute|ca_5"
  "5|/api/cardio_imaging_v2/echocardiogram|ci_1"
  "6|/api/cardio_imaging_v2/cardiac_mri|ci_2"
  "7|/api/cardio_imaging_v2/cardiac_ct|ci_3"
  "8|/api/cardio_imaging_v2/stress_test|ci_4"
  "9|/api/cardio_imaging_v2/holter_monitoring|ci_5"
  "10|/api/cardio_intervention_v2/pci|cin_1"
  "11|/api/cardio_intervention_v2/cabg|cin_2"
  "12|/api/cardio_intervention_v2/device_implant|cin_3"
  "13|/api/cardio_intervention_v2/ablation|cin_4"
  "14|/api/cardio_intervention_v2/tavr|cin_5"
  "15|/api/cardio_ep_v2/pacemaker_followup|cep_1"
  "16|/api/cardio_ep_v2/icd_followup|cep_2"
  "17|/api/cardio_ep_v2/anticoagulation_cardio|cep_3"
  "18|/api/cardio_ep_v2/lipid_management|cep_4"
  "19|/api/cardio_ep_v2/cardiac_rehab|cep_5"
  "20|/api/cardio_valve_v2/aortic_stenosis|cv_1"
  "21|/api/cardio_valve_v2/mitral_regurgitation|cv_2"
  "22|/api/cardio_valve_v2/tricuspid_regurg|cv_3"
  "23|/api/cardio_valve_v2/valve_surgery|cv_4"
  "24|/api/cardio_valve_v2/endocarditis|cv_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
