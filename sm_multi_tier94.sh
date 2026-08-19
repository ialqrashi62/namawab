#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/pulm_function_v2/spirometry|pf_1"
  "1|/api/pulm_function_v2/lung_volumes|pf_2"
  "2|/api/pulm_function_v2/dlco|pf_3"
  "3|/api/pulm_function_v2/six_min_walk|pf_4"
  "4|/api/pulm_function_v2/mip_mep|pf_5"
  "5|/api/pulm_sleep_v2/osa_assessment|ps_1"
  "6|/api/pulm_sleep_v2/cpap_titration|ps_2"
  "7|/api/pulm_sleep_v2/polysomnography|ps_3"
  "8|/api/pulm_sleep_v2/sleep_hygiene|ps_4"
  "9|/api/pulm_sleep_v2/narcolepsy|ps_5"
  "10|/api/pulm_interstitial_v2/ild_diagnosis|pi_1"
  "11|/api/pulm_interstitial_v2/ipf_diagnosis|pi_2"
  "12|/api/pulm_interstitial_v2/sarcoidosis|pi_3"
  "13|/api/pulm_interstitial_v2/hypersensitivity_pneumonitis|pi_4"
  "14|/api/pulm_interstitial_v2/connective_tissue_ild|pi_5"
  "15|/api/pulm_vascular_v2/pah_diagnosis|pv_1"
  "16|/api/pulm_vascular_v2/cteph|pv_2"
  "17|/api/pulm_vascular_v2/pulmonary_edema|pv_3"
  "18|/api/pulm_vascular_v2/pulmonary_embolism|pv_4"
  "19|/api/pulm_vascular_v2/pulmonary_hypertension|pv_5"
  "20|/api/pulm_pleural_v2/pleural_effusion|pp_1"
  "21|/api/pulm_pleural_v2/thoracentesis|pp_2"
  "22|/api/pulm_pleural_v2/chest_tube|pp_3"
  "23|/api/pulm_pleural_v2/pleurodesis|pp_4"
  "24|/api/pulm_pleural_v2/empyema|pp_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
