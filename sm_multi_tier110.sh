#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/pharmacy_clinical_v2/order_review|ph_0"
  "1|/api/pharmacy_clinical_v2/renal_dosing|ph_1"
  "2|/api/pharmacy_clinical_v2/hepatic_dosing|ph_2"
  "3|/api/pharmacy_clinical_v2/therapeutic_drug_monitoring|ph_3"
  "4|/api/pharmacy_clinical_v2/iv_to_po_conversion|ph_4"
  "5|/api/antimicrobial_stewardship_v2/culture_review|as_5"
  "6|/api/antimicrobial_stewardship_v2/antibiotic_choice|as_6"
  "7|/api/antimicrobial_stewardship_v2/duration_assessment|as_7"
  "8|/api/antimicrobial_stewardship_v2/iv_to_po_switch|as_8"
  "9|/api/antimicrobial_stewardship_v2/resistance_pattern|as_9"
  "10|/api/chemotherapy_pharmacy_v2/regimen_protocol|oc_10"
  "11|/api/chemotherapy_pharmacy_v2/dose_calculation|oc_11"
  "12|/api/chemotherapy_pharmacy_v2/premedication|oc_12"
  "13|/api/chemotherapy_pharmacy_v2/toxicity_monitoring|oc_13"
  "14|/api/chemotherapy_pharmacy_v2/cycle_assessment|oc_14"
  "15|/api/adverse_drug_reaction_v2/reaction_reporting|adr_15"
  "16|/api/adverse_drug_reaction_v2/causality_assessment|adr_16"
  "17|/api/adverse_drug_reaction_v2/severity_grading|adr_17"
  "18|/api/adverse_drug_reaction_v2/allergy_labeling|adr_18"
  "19|/api/adverse_drug_reaction_v2/reporting_to_fda|adr_19"
  "20|/api/medication_safety_v2/high_alert_medication|ms_20"
  "21|/api/medication_safety_v2/look_alike_sound_alike|ms_21"
  "22|/api/medication_safety_v2/double_check|ms_22"
  "23|/api/medication_safety_v2/cis|ms_23"
  "24|/api/medication_safety_v2/smart_pump|ms_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"