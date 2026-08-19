#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/er_ext_v2/triage_protocol|er_0"
  "1|/api/er_ext_v2/fast_track|er_1"
  "2|/api/er_ext_v2/critical_care|er_2"
  "3|/api/er_ext_v2/observation|er_3"
  "4|/api/er_ext_v2/discharge_planning|er_4"
  "5|/api/trauma_center_v2/trauma_team_activation|tr_5"
  "6|/api/trauma_center_v2/massive_transfusion|tr_6"
  "7|/api/trauma_center_v2/damage_control_surgery|tr_7"
  "8|/api/trauma_center_v2/icu_admission|tr_8"
  "9|/api/trauma_center_v2/rehab_referral|tr_9"
  "10|/api/disaster_v2/incident_command|ds_10"
  "11|/api/disaster_v2/triage_disaster|ds_11"
  "12|/api/disaster_v2/resource_surge|ds_12"
  "13|/api/disaster_v2/decontamination|ds_13"
  "14|/api/disaster_v2/evacuation|ds_14"
  "15|/api/poison_control_v2/exposure_assessment|pc_15"
  "16|/api/poison_control_v2/antidote_administration|pc_16"
  "17|/api/poison_control_v2/observation_period|pc_17"
  "18|/api/poison_control_v2/follow_up_call|pc_18"
  "19|/api/poison_control_v2/toxicology_screen|pc_19"
  "20|/api/pre_hospital_v2/ems_dispatch|ph_20"
  "21|/api/pre_hospital_v2/field_triage|ph_21"
  "22|/api/pre_hospital_v2/transport_decision|ph_22"
  "23|/api/pre_hospital_v2/pre_hospital_care|ph_23"
  "24|/api/pre_hospital_v2/handover|ph_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"