#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/obgyn_antenatal_v2/antenatal_initial|oa_ai"
  "1|/api/obgyn_antenatal_v2/antenatal_followup|oa_af"
  "2|/api/obgyn_antenatal_v2/high_risk_preg|oa_hr"
  "3|/api/obgyn_antenatal_v2/rhesus_isoimmunization|oa_ri"
  "4|/api/obgyn_antenatal_v2/multiples|oa_mp"
  "5|/api/obgyn_gyne_v2/menstrual_disorder|og_md"
  "6|/api/obgyn_gyne_v2/infertility_eval|og_ie"
  "7|/api/obgyn_gyne_v2/contraception_counseling|og_cc"
  "8|/api/obgyn_gyne_v2/menopause|og_mn"
  "9|/api/obgyn_gyne_v2/pelvic_pain|og_pp"
  "10|/api/obgyn_onc_v2/cervical_screening|oo_cs"
  "11|/api/obgyn_onc_v2/ovarian_cyst|oo_oc"
  "12|/api/obgyn_onc_v2/endometrial_cancer|oo_ec"
  "13|/api/obgyn_onc_v2/cervical_cancer|oo_cc2"
  "14|/api/obgyn_onc_v2/brca_counseling|oo_brca"
  "15|/api/obgyn_labor_v2/labor_admission|ol_la"
  "16|/api/obgyn_labor_v2/labor_monitoring|ol_lm"
  "17|/api/obgyn_labor_v2/vaginal_delivery|ol_vd"
  "18|/api/obgyn_labor_v2/cesarean_section|ol_cs"
  "19|/api/obgyn_labor_v2/postpartum_care|ol_pp"
  "20|/api/obgyn_repro_v2/ivf_cycle|or_ivf"
  "21|/api/obgyn_repro_v2/iui_cycle|or_iui"
  "22|/api/obgyn_repro_v2/recurrent_pregnancy_loss|or_rpl"
  "23|/api/obgyn_repro_v2/pcos_eval|or_pcos"
  "24|/api/obgyn_repro_v2/endometriosis|or_end"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
