#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/cardiac_cath_v2/diagnostic_cath|cc_0"
  "1|/api/cardiac_cath_v2/intervention|cc_1"
  "2|/api/cardiac_cath_v2/pci|cc_2"
  "3|/api/cardiac_cath_v2/thrombectomy|cc_3"
  "4|/api/cardiac_cath_v2/structural|cc_4"
  "5|/api/cardiac_rehab_v2/enrollment|cr_5"
  "6|/api/cardiac_rehab_v2/exercise_session|cr_6"
  "7|/api/cardiac_rehab_v2/education|cr_7"
  "8|/api/cardiac_rehab_v2/outcome_assessment|cr_8"
  "9|/api/cardiac_rehab_v2/completion|cr_9"
  "10|/api/electrophysiology_v2/ablation|ep_10"
  "11|/api/electrophysiology_v2/device_check|ep_11"
  "12|/api/electrophysiology_v2/afib_management|ep_12"
  "13|/api/electrophysiology_v2/syncope_workup|ep_13"
  "14|/api/electrophysiology_v2/icd_followup|ep_14"
  "15|/api/dialysis_v2/hd_session|dl_15"
  "16|/api/dialysis_v2/peritoneal_dialysis|dl_16"
  "17|/api/dialysis_v2/dialysis_access|dl_17"
  "18|/api/dialysis_v2/anemia_management|dl_18"
  "19|/api/dialysis_v2/bone_mineral|dl_19"
  "20|/api/neuro_diag_v2/eeg|nd_20"
  "21|/api/neuro_diag_v2/eeg_monitoring|nd_21"
  "22|/api/neuro_diag_v2/emg_ncs|nd_22"
  "23|/api/neuro_diag_v2/evoked_potentials|nd_23"
  "24|/api/neuro_diag_v2/lumbar_puncture|nd_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"