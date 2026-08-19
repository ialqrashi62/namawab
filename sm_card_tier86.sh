#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/card_heart_failure_v2/hf_initial|chf_i"
  "1|/api/card_heart_failure_v2/hf_followup|chf_f"
  "2|/api/card_heart_failure_v2/cardiomyopathy|chf_c"
  "3|/api/card_heart_failure_v2/aldosterone_antag|chf_aa"
  "4|/api/card_heart_failure_v2/heart_transplant|chf_ht"
  "5|/api/card_intervention_v2/cath_followup|ci_c"
  "6|/api/card_intervention_v2/pci_followup|ci_p"
  "7|/api/card_intervention_v2/cabg_followup|ci_cb"
  "8|/api/card_intervention_v2/structural_followup|ci_s"
  "9|/api/card_intervention_v2/tavr_followup|ci_t"
  "10|/api/card_imaging_v2/echo_followup|cim_e"
  "11|/api/card_imaging_v2/stress_test|cim_st"
  "12|/api/card_imaging_v2/nuclear_imaging|cim_n"
  "13|/api/card_imaging_v2/cardiac_mri|cim_m"
  "14|/api/card_imaging_v2/cardiac_ct_angio|cim_ct"
  "15|/api/card_rehab_v2/cr_initial|cr_i"
  "16|/api/card_rehab_v2/cr_phase2|cr_p"
  "17|/api/card_rehab_v2/cr_discharge|cr_d"
  "18|/api/card_rehab_v2/cr_followup|cr_f"
  "19|/api/card_rehab_v2/cr_outcomes|cr_o"
  "20|/api/card_arrhythmia_v2/afib_initial|ca_af"
  "21|/api/card_arrhythmia_v2/afib_followup|ca_afu"
  "22|/api/card_arrhythmia_v2/anticoag_clinic|ca_ac"
  "23|/api/card_arrhythmia_v2/vt_eval|ca_vt"
  "24|/api/card_arrhythmia_v2/device_check|ca_dc"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
