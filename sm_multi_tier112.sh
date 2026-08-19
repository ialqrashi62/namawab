#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/infection_control_v2/hai_surveillance|ic_0"
  "1|/api/infection_control_v2/isolation_precautions|ic_1"
  "2|/api/infection_control_v2/catheter_bundle|ic_2"
  "3|/api/infection_control_v2/ssi_prevention|ic_3"
  "4|/api/infection_control_v2/hand_hygiene_compliance|ic_4"
  "5|/api/pathogen_tracking_v2/outbreak_detection|pt_5"
  "6|/api/pathogen_tracking_v2/whole_genome_sequencing|pt_6"
  "7|/api/pathogen_tracking_v2/contact_tracing|pt_7"
  "8|/api/pathogen_tracking_v2/environmental_sampling|pt_8"
  "9|/api/pathogen_tracking_v2/line_listing|pt_9"
  "10|/api/immunization_v2/vaccination_schedule|im_10"
  "11|/api/immunization_v2/vaccine_administration|im_11"
  "12|/api/immunization_v2/contraindication_screening|im_12"
  "13|/api/immunization_v2/titer_checking|im_13"
  "14|/api/immunization_v2/travel_vaccination|im_14"
  "15|/api/sterilization_v2/sterilization_validation|st_15"
  "16|/api/sterilization_v2/biological_indicator|st_16"
  "17|/api/sterilization_v2/chemical_indicator|st_17"
  "18|/api/sterilization_v2/sterilization_failure|st_18"
  "19|/api/sterilization_v2/scope_reprocessing|st_19"
  "20|/api/stew_extended_v2/local_antibiogram|se_20"
  "21|/api/stew_extended_v2/antibiotic_d_drug_specific|se_21"
  "22|/api/stew_extended_v2/resistance_trend|se_22"
  "23|/api/stew_extended_v2/intervention_metrics|se_23"
  "24|/api/stew_extended_v2/antibiogram_alert|se_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"