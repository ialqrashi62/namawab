#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/icu_extended_v2/mechanical_ventilation|ic_1"
  "1|/api/icu_extended_v2/ards_management|ic_2"
  "2|/api/icu_extended_v2/septic_shock|ic_3"
  "3|/api/icu_extended_v2/icu_delirium|ic_4"
  "4|/api/icu_extended_v2/icu_nutrition|ic_5"
  "5|/api/ed_extended_v2/ed_triage|ed_1"
  "6|/api/ed_extended_v2/trauma_assessment|ed_2"
  "7|/api/ed_extended_v2/stroke_alert|ed_3"
  "8|/api/ed_extended_v2/overdose_toxicology|ed_4"
  "9|/api/ed_extended_v2/ed_discharge|ed_5"
  "10|/api/perioperative_v2/preanesthetic_eval|pe_1"
  "11|/api/perioperative_v2/intraoperative_monitoring|pe_2"
  "12|/api/perioperative_v2/pacu|pe_3"
  "13|/api/perioperative_v2/postop_complications|pe_4"
  "14|/api/perioperative_v2/enhanced_recovery|pe_5"
  "15|/api/rehab_v2/stroke_rehab|rh_1"
  "16|/api/rehab_v2/cardiac_rehab_phase2|rh_2"
  "17|/api/rehab_v2/pulmonary_rehab|rh_3"
  "18|/api/rehab_v2/joint_replacement|rh_4"
  "19|/api/rehab_v2/amputee_rehab|rh_5"
  "20|/api/oncology_extended_v2/tumor_board|oe_1"
  "21|/api/oncology_extended_v2/molecular_profiling|oe_2"
  "22|/api/oncology_extended_v2/clinical_trial|oe_3"
  "23|/api/oncology_extended_v2/survivorship_followup|oe_4"
  "24|/api/oncology_extended_v2/hospice_referral|oe_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
