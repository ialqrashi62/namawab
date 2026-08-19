#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/pain_mgmt_v2/pain_assessment|pm_0"
  "1|/api/pain_mgmt_v2/opioid_prescribing|pm_1"
  "2|/api/pain_mgmt_v2/non_opioid_treatment|pm_2"
  "3|/api/pain_mgmt_v2/interventional_pain|pm_3"
  "4|/api/pain_mgmt_v2/pain_followup|pm_4"
  "5|/api/palliative_care_v2/palliative_assessment|pc_5"
  "6|/api/palliative_care_v2/symptom_management|pc_6"
  "7|/api/palliative_care_v2/goals_of_care|pc_7"
  "8|/api/palliative_care_v2/hospice_referral|pc_8"
  "9|/api/palliative_care_v2/bereavement|pc_9"
  "10|/api/spine_care_v2/spine_assessment|sp_10"
  "11|/api/spine_care_v2/conservative_treatment|sp_11"
  "12|/api/spine_care_v2/spine_injection|sp_12"
  "13|/api/spine_care_v2/spine_surgery|sp_13"
  "14|/api/spine_care_v2/post_op_spine|sp_14"
  "15|/api/sports_medicine_v2/sports_assessment|sm_15"
  "16|/api/sports_medicine_v2/injury_treatment|sm_16"
  "17|/api/sports_medicine_v2/rehabilitation|sm_17"
  "18|/api/sports_medicine_v2/return_to_play|sm_18"
  "19|/api/sports_medicine_v2/concussion|sm_19"
  "20|/api/sleep_medicine_v2/sleep_assessment|sl_20"
  "21|/api/sleep_medicine_v2/polysomnography|sl_21"
  "22|/api/sleep_medicine_v2/cpap_titration|sl_22"
  "23|/api/sleep_medicine_v2/insomnia_treatment|sl_23"
  "24|/api/sleep_medicine_v2/sleep_followup|sl_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"