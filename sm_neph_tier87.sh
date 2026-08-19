#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/neph_general_v2/neph_clinic|ng_c"
  "1|/api/neph_general_v2/ckd_eval|ng_ckd"
  "2|/api/neph_general_v2/ckd_followup|ng_ckdf"
  "3|/api/neph_general_v2/glomerulonephritis|ng_gn"
  "4|/api/neph_general_v2/polycystic_kidney|ng_pk"
  "5|/api/neph_dialysis_v2/hemodialysis_initial|nd_hdi"
  "6|/api/neph_dialysis_v2/hemodialysis_followup|nd_hdf"
  "7|/api/neph_dialysis_v2/dialysis_adequacy|nd_da"
  "8|/api/neph_dialysis_v2/electrolyte_management|nd_em"
  "9|/api/neph_dialysis_v2/dry_weight|nd_dw"
  "10|/api/neph_nephrology_v2/hypertension_renal|nn_ht"
  "11|/api/neph_nephrology_v2/proteinuria_hematuria|nn_ph"
  "12|/api/neph_nephrology_v2/renal_stones|nn_rs"
  "13|/api/neph_nephrology_v2/renal_cyst|nn_rc"
  "14|/api/neph_nephrology_v2/proteinuric_disease|nn_pd"
  "15|/api/neph_geri_v2/geri_neph|nr_g"
  "16|/api/neph_geri_v2/elderly_ckd|nr_ec"
  "17|/api/neph_geri_v2/gentiurian_dialysis|nr_gd"
  "18|/api/neph_geri_v2/nephro_epidemic|nr_ne"
  "19|/api/neph_geri_v2/nephro_global|nr_ng"
  "20|/api/neph_advanced_v2/peritoneal_dialysis|na_pd"
  "21|/api/neph_advanced_v2/transplant_clinic|na_tc"
  "22|/api/neph_advanced_v2/dialysis_vascular_access|na_va"
  "23|/api/neph_advanced_v2/anemia_ckd|na_ac"
  "24|/api/neph_advanced_v2/bone_metabolism_ckd|na_bm"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neph_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
