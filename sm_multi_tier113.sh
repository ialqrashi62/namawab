#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/ob_extended_v2/lactation_consult|ob_0"
  "1|/api/ob_extended_v2/breastfeeding_assessment|ob_1"
  "2|/api/ob_extended_v2/nipple_pain|ob_2"
  "3|/api/ob_extended_v2/mastitis|ob_3"
  "4|/api/ob_extended_v2/low_milk_supply|ob_4"
  "5|/api/maternal_med_v2/preeclampsia_management|mm_5"
  "6|/api/maternal_med_v2/gestational_diabetes|mm_6"
  "7|/api/maternal_med_v2/thyroid_pregnancy|mm_7"
  "8|/api/maternal_med_v2/cardiac_pregnancy|mm_8"
  "9|/api/maternal_med_v2/antepartum_assessment|mm_9"
  "10|/api/reproductive_endocrine_v2/pcos|re_10"
  "11|/api/reproductive_endocrine_v2/amenorrhea|re_11"
  "12|/api/reproductive_endocrine_v2/hirsutism|re_12"
  "13|/api/reproductive_endocrine_v2/menopause_eval|re_13"
  "14|/api/reproductive_endocrine_v2/androgen_excess|re_14"
  "15|/api/fertility_v2/fertility_workup|ft_15"
  "16|/api/fertility_v2/ovulation_tracking|ft_16"
  "17|/api/fertility_v2/iui_cycle|ft_17"
  "18|/api/fertility_v2/embryo_transfer|ft_18"
  "19|/api/fertility_v2/fertility_outcome|ft_19"
  "20|/api/gyne_onc_extended_v2/tumor_marker|go_20"
  "21|/api/gyne_onc_extended_v2/genetic_counseling|go_21"
  "22|/api/gyne_onc_extended_v2/chemotherapy_cyc|go_22"
  "23|/api/gyne_onc_extended_v2/radiation_planning|go_23"
  "24|/api/gyne_onc_extended_v2/palliative_care_onc|go_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"