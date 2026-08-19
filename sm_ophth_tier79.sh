#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/ophth_general_v2/vision_screening|op_v"
  "1|/api/ophth_general_v2/refraction|op_r"
  "2|/api/ophth_general_v2/iop_check|op_i"
  "3|/api/ophth_general_v2/dilate_exam|op_d"
  "4|/api/ophth_general_v2/routine_exam|op_ex"
  "5|/api/ophth_retina_v2/diabetic_retinopathy|op_dr"
  "6|/api/ophth_retina_v2/amd_management|op_amd"
  "7|/api/ophth_retina_v2/retinal_detachment|op_rd"
  "8|/api/ophth_retina_v2/intravitreal_injection|op_ivi"
  "9|/api/ophth_retina_v2/oct_scan|op_oct"
  "10|/api/ophth_cataract_v2/cataract_eval|op_ce"
  "11|/api/ophth_cataract_v2/cataract_surgery|op_cs"
  "12|/api/ophth_cataract_v2/pre_op_assessment|op_po"
  "13|/api/ophth_cataract_v2/post_op_care|op_pc"
  "14|/api/ophth_cataract_v2/yag_capsulotomy|op_yag"
  "15|/api/ophth_glaucoma_v2/glaucoma_initial|op_gi"
  "16|/api/ophth_glaucoma_v2/visual_field|op_vf"
  "17|/api/ophth_glaucoma_v2/oct_rnfl|op_octr"
  "18|/api/ophth_glaucoma_v2/glaucoma_medication|op_gm"
  "19|/api/ophth_glaucoma_v2/glaucoma_surgery|op_gs"
  "20|/api/ophth_pediatric_v2/pediatric_exam|op_pe"
  "21|/api/ophth_pediatric_v2/amblyopia|op_am"
  "22|/api/ophth_pediatric_v2/strabismus|op_str"
  "23|/api/ophth_pediatric_v2/retinopathy_prematurity|op_rop"
  "24|/api/ophth_pediatric_v2/pediatric_cataract|op_pc"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1)
  URL=$(echo "$T" | cut -d'|' -f2)
  TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/oph_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
