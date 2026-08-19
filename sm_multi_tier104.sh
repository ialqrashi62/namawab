#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/quality_v2/accreditation|qa_0"
  "1|/api/quality_v2/cms_metrics|qa_1"
  "2|/api/quality_v2/value_based_care|qa_2"
  "3|/api/quality_v2/patient_experience|qa_3"
  "4|/api/quality_v2/hospital_scorecard|qa_4"
  "5|/api/compliance_v2/regulatory_compliance|cp_5"
  "6|/api/compliance_v2/audit_response|cp_6"
  "7|/api/compliance_v2/policy_management|cp_7"
  "8|/api/compliance_v2/training_compliance|cp_8"
  "9|/api/compliance_v2/incident_reporting|cp_9"
  "10|/api/epidemiology_v2/disease_surveillance|ep_10"
  "11|/api/epidemiology_v2/outbreak_investigation|ep_11"
  "12|/api/epidemiology_v2/vaccine_tracking|ep_12"
  "13|/api/epidemiology_v2/screening_program|ep_13"
  "14|/api/epidemiology_v2/registry_data|ep_14"
  "15|/api/public_health_v2/community_health|ph_15"
  "16|/api/public_health_v2/health_education|ph_16"
  "17|/api/public_health_v2/screening_program|ph_17"
  "18|/api/public_health_v2/environmental_health|ph_18"
  "19|/api/public_health_v2/maternal_child_health|ph_19"
  "20|/api/telemedicine_v2/tele_consult|tm_20"
  "21|/api/telemedicine_v2/remote_monitoring|tm_21"
  "22|/api/telemedicine_v2/store_and_forward|tm_22"
  "23|/api/telemedicine_v2/virtual_triage|tm_23"
  "24|/api/telemedicine_v2/tele_icu|tm_24"
  "25|/api/qi_v2/qi_project|qi_25"
  "26|/api/qi_v2/clinical_audit|qi_26"
  "27|/api/qi_v2/patient_safety|qi_27"
  "28|/api/qi_v2/sentinel_event|qi_28"
  "29|/api/qi_v2/quality_metrics|qi_29"
  "30|/api/research_v2/research_protocol|rs_30"
  "31|/api/research_v2/clinical_trial_enrollment|rs_31"
  "32|/api/research_v2/data_collection|rs_32"
  "33|/api/research_v2/manuscript_prep|rs_33"
  "34|/api/research_v2/irb_submission|rs_34"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
