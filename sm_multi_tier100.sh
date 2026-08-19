#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/obgyn_mfm_v2/prenatal_visit|ob_1"
  "1|/api/obgyn_mfm_v2/high_risk_pregnancy|ob_2"
  "2|/api/obgyn_mfm_v2/preeclampsia|ob_3"
  "3|/api/obgyn_mfm_v2/gestational_diabetes_mgmt|ob_4"
  "4|/api/obgyn_mfm_v2/delivery_summary|ob_5"
  "5|/api/obgyn_gyn_onc_v2/ovarian_cyst|go_1"
  "6|/api/obgyn_gyn_onc_v2/cervical_cancer_screening|go_2"
  "7|/api/obgyn_gyn_onc_v2/endometrial_cancer|go_3"
  "8|/api/obgyn_gyn_onc_v2/ovarian_cancer_staging|go_4"
  "9|/api/obgyn_gyn_onc_v2/gyn_chemotherapy|go_5"
  "10|/api/obgyn_rei_v2/infertility_workup|rei_1"
  "11|/api/obgyn_rei_v2/ovulation_induction|rei_2"
  "12|/api/obgyn_rei_v2/ivf_cycle|rei_3"
  "13|/api/obgyn_rei_v2/icsi|rei_4"
  "14|/api/obgyn_rei_v2/recurrent_pregnancy_loss|rei_5"
  "15|/api/obgyn_menopause_v2/menopause_assessment|men_1"
  "16|/api/obgyn_menopause_v2/hrt_therapy|men_2"
  "17|/api/obgyn_menopause_v2/urogynecology|men_3"
  "18|/api/obgyn_menopause_v2/abnormal_uterine_bleeding|men_4"
  "19|/api/obgyn_menopause_v2/endometriosis|men_5"
  "20|/api/obgyn_reproductive_v2/contraception_counseling|rh_1"
  "21|/api/obgyn_reproductive_v2/iud_insertion|rh_2"
  "22|/api/obgyn_reproductive_v2/sti_screening|rh_3"
  "23|/api/obgyn_reproductive_v2/pelvic_pain|rh_4"
  "24|/api/obgyn_reproductive_v2/gyne_surgery|rh_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
