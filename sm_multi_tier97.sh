#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/neph_acute_v2/aki_diagnosis|na_1"
  "1|/api/neph_acute_v2/dialysis_initiation|na_2"
  "2|/api/neph_acute_v2/ckd_staging|na_3"
  "3|/api/neph_acute_v2/electrolyte_management|na_4"
  "4|/api/neph_acute_v2/acid_base|na_5"
  "5|/api/neph_glomerular_v2/glomerulonephritis|ng_1"
  "6|/api/neph_glomerular_v2/diabetic_nephropathy|ng_2"
  "7|/api/neph_glomerular_v2/polycystic_kidney|ng_3"
  "8|/api/neph_glomerular_v2/renal_transplant|ng_4"
  "9|/api/neph_glomerular_v2/renal_stones|ng_5"
  "10|/api/neph_vascular_v2/renovascular|nv_1"
  "11|/api/neph_vascular_v2/htn_renal|nv_2"
  "12|/api/neph_vascular_v2/cardiorenal|nv_3"
  "13|/api/neph_vascular_v2/hepatorenal|nv_4"
  "14|/api/neph_vascular_v2/obstructive_uropathy|nv_5"
  "15|/api/neph_dialysis_v2/hemodialysis|nd_1"
  "16|/api/neph_dialysis_v2/peritoneal_dialysis|nd_2"
  "17|/api/neph_dialysis_v2/vascular_access|nd_3"
  "18|/api/neph_dialysis_v2/anemia_ckd|nd_4"
  "19|/api/neph_dialysis_v2/mineral_bone_ckd|nd_5"
  "20|/api/neph_imaging_v2/renal_ultrasound|ni_1"
  "21|/api/neph_imaging_v2/renal_ct|ni_2"
  "22|/api/neph_imaging_v2/renal_biopsy|ni_3"
  "23|/api/neph_imaging_v2/renal_nuclear|ni_4"
  "24|/api/neph_imaging_v2/renal_angiography|ni_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
