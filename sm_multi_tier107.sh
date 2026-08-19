#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/nursing_assess_v2/vital_signs|na_0"
  "1|/api/nursing_assess_v2/pain_assessment|na_1"
  "2|/api/nursing_assess_v2/fall_risk|na_2"
  "3|/api/nursing_assess_v2/braden_scale|na_3"
  "4|/api/nursing_assess_v2/nursing_diagnosis|na_4"
  "5|/api/nursing_med_admin_v2/medication_administration|nm_5"
  "6|/api/nursing_med_admin_v2/barcode_scanning|nm_6"
  "7|/api/nursing_med_admin_v2/iv_pump_programming|nm_7"
  "8|/api/nursing_med_admin_v2/double_check_medication|nm_8"
  "9|/api/nursing_med_admin_v2/medication_reconciliation|nm_9"
  "10|/api/wound_care_v2/wound_assessment|wc_10"
  "11|/api/wound_care_v2/dressing_change|wc_11"
  "12|/api/wound_care_v2/pressure_injury|wc_12"
  "13|/api/wound_care_v2/ostomy_care|wc_13"
  "14|/api/wound_care_v2/wound_healing|wc_14"
  "15|/api/iv_therapy_v2/iv_insertion|iv_15"
  "16|/api/iv_therapy_v2/iv_maintenance|iv_16"
  "17|/api/iv_therapy_v2/central_line|iv_17"
  "18|/api/iv_therapy_v2/phlebotomy|iv_18"
  "19|/api/iv_therapy_v2/infusion_reaction|iv_19"
  "20|/api/allied_health_v2/physical_therapy|ah_20"
  "21|/api/allied_health_v2/occupational_therapy|ah_21"
  "22|/api/allied_health_v2/speech_therapy|ah_22"
  "23|/api/allied_health_v2/respiratory_therapy|ah_23"
  "24|/api/allied_health_v2/dietary_consult|ah_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"