#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/geriatric_assessment_v2/comprehensive_assessment|grp_1"
  "1|/api/geriatric_assessment_v2/adl_iadl|grp_2"
  "2|/api/geriatric_assessment_v2/cognitive_screening|grp_3"
  "3|/api/geriatric_assessment_v2/functional_status|grp_4"
  "4|/api/geriatric_assessment_v2/social_assessment|grp_5"
  "5|/api/geriatric_falls_v2/fall_risk|grf_1"
  "6|/api/geriatric_falls_v2/home_safety|grf_2"
  "7|/api/geriatric_falls_v2/balance_training|grf_3"
  "8|/api/geriatric_falls_v2/post_fall|grf_4"
  "9|/api/geriatric_falls_v2/fall_prevention|grf_5"
  "10|/api/geriatric_polypharmacy_v2/medication_reconciliation|grpp_1"
  "11|/api/geriatric_polypharmacy_v2/beers_criteria|grpp_2"
  "12|/api/geriatric_polypharmacy_v2/deprescribing|grpp_3"
  "13|/api/geriatric_polypharmacy_v2/adherence|grpp_4"
  "14|/api/geriatric_polypharmacy_v2/prescribing_principles|grpp_5"
  "15|/api/geriatric_dementia_v2/dementia_diagnosis|grd_1"
  "16|/api/geriatric_dementia_v2/bpsd|grd_2"
  "17|/api/geriatric_dementia_v2/dementia_medications|grd_3"
  "18|/api/geriatric_dementia_v2/caregiver_support|grd_4"
  "19|/api/geriatric_dementia_v2/safety_assessment|grd_5"
  "20|/api/geriatric_palliative_v2/advance_care_planning|grpa_1"
  "21|/api/geriatric_palliative_v2/frailty_assessment|grpa_2"
  "22|/api/geriatric_palliative_v2/nursing_home_placement|grpa_3"
  "23|/api/geriatric_palliative_v2/hospice_eligibility|grpa_4"
  "24|/api/geriatric_palliative_v2/goals_care_old|grpa_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
