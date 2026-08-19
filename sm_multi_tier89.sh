#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/oncology_chemo_v2/chemotherapy_regimen|oc_1"
  "1|/api/oncology_chemo_v2/cycle_count|oc_2"
  "2|/api/oncology_chemo_v2/dose_intensity|oc_3"
  "3|/api/oncology_chemo_v2/toxicity_assessment|oc_4"
  "4|/api/oncology_chemo_v2/efficacy_imaging|oc_5"
  "5|/api/oncology_radiation_v2/radiation_planning|or_1"
  "6|/api/oncology_radiation_v2/dose_tracking|or_2"
  "7|/api/oncology_radiation_v2/site_specific|or_3"
  "8|/api/oncology_radiation_v2/radiation_toxicity|or_4"
  "9|/api/oncology_radiation_v2/brachytherapy|or_5"
  "10|/api/hematology_benign_v2/anemia_workup|hb_1"
  "11|/api/hematology_benign_v2/iron_deficiency|hb_2"
  "12|/api/hematology_benign_v2/hemolysis_workup|hb_3"
  "13|/api/hematology_benign_v2/bone_marrow|hb_4"
  "14|/api/hematology_benign_v2/anticoagulation|hb_5"
  "15|/api/oncology_support_v2/palliative_care|os_1"
  "16|/api/oncology_support_v2/pain_management|os_2"
  "17|/api/oncology_support_v2/psychosocial_support|os_3"
  "18|/api/oncology_support_v2/goals_of_care|os_4"
  "19|/api/oncology_support_v2/nutrition_support|os_5"
  "20|/api/oncology_survivorship_v2/survivorship_plan|osv_1"
  "21|/api/oncology_survivorship_v2/late_effects|osv_2"
  "22|/api/oncology_survivorship_v2/screening_recurrence|osv_3"
  "23|/api/oncology_survivorship_v2/lifestyle_counseling|osv_4"
  "24|/api/oncology_survivorship_v2/followup_schedule|osv_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
