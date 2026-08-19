#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/uro_general_v2/uro_clinic|ug_c"
  "1|/api/uro_general_v2/hematuria_workup|ug_h"
  "2|/api/uro_general_v2/incontinence|ug_i"
  "3|/api/uro_general_v2/urodynamics|ug_u"
  "4|/api/uro_general_v2/prostate_benign|ug_pb"
  "5|/api/uro_renal_v2/renal_stone|ur_rs"
  "6|/api/uro_renal_v2/renal_mass|ur_rm"
  "7|/api/uro_renal_v2/renal_failure|ur_rf"
  "8|/api/uro_renal_v2/uti_management|ur_ut"
  "9|/api/uro_renal_v2/prostate_biopsy|ur_pb"
  "10|/api/uro_onco_v2/bladder_cancer|uo_bc"
  "11|/api/uro_onco_v2/prostate_cancer|uo_pc"
  "12|/api/uro_onco_v2/renal_cancer|uo_rc"
  "13|/api/uro_onco_v2/testicular_cancer|uo_tc"
  "14|/api/uro_onco_v2/uro_chemo|uo_uc"
  "15|/api/uro_peds_v2/pediatric_enuresis|up_pe"
  "16|/api/uro_peds_v2/cryptorchidism|up_cr"
  "17|/api/uro_peds_v2/hypospadias|up_hy"
  "18|/api/uro_peds_v2/circumcision|up_ci"
  "19|/api/uro_peds_v2/pediatric_vesicoureteral|up_vu"
  "20|/api/uro_andrology_v2/erectile_dysfunction|ua_ed"
  "21|/api/uro_andrology_v2/infertility|ua_if"
  "22|/api/uro_andrology_v2/peyronie_disease|ua_pd"
  "23|/api/uro_andrology_v2/vasectomy|ua_va"
  "24|/api/uro_andrology_v2/vasectomy_reversal|ua_vr"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/uro_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
