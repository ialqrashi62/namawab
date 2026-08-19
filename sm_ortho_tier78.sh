#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/ortho_trauma_v2/trauma_initial|ot_tr_init"
  "1|/api/ortho_trauma_v2/fracture_reduction|ot_tr_red"
  "2|/api/ortho_trauma_v2/fracture_orif|ot_tr_or"
  "3|/api/ortho_trauma_v2/soft_tissue_injury|ot_tr_st"
  "4|/api/ortho_trauma_v2/polytrauma|ot_tr_pol"
  "5|/api/ortho_joint_v2/joint_replacement|ot_jr"
  "6|/api/ortho_joint_v2/arthroscopy|ot_art"
  "7|/api/ortho_joint_v2/joint_injection|ot_ji"
  "8|/api/ortho_joint_v2/joint_aspiration|ot_ja"
  "9|/api/ortho_joint_v2/joint_clinic|ot_jc"
  "10|/api/ortho_spine_v2/spine_clinic|ot_sc"
  "11|/api/ortho_spine_v2/discectomy|ot_dc"
  "12|/api/ortho_spine_v2/spinal_fusion|ot_sf"
  "13|/api/ortho_spine_v2/spine_fracture|ot_sx"
  "14|/api/ortho_spine_v2/scoliosis|ot_sl"
  "15|/api/ortho_sports_v2/acl_reconstruction|ot_sp_acl"
  "16|/api/ortho_sports_v2/rotator_cuff_repair|ot_sp_rc"
  "17|/api/ortho_sports_v2/meniscus_repair|ot_sp_mr"
  "18|/api/ortho_sports_v2/shoulder_impingement|ot_sp_si"
  "19|/api/ortho_sports_v2/sports_clearance|ot_sp_sc"
  "20|/api/ortho_pediatric_v2/developmental_dysplasia|ot_pd_dd"
  "21|/api/ortho_pediatric_v2/clubfoot|ot_pd_cf"
  "22|/api/ortho_pediatric_v2/scoliosis_juvenile|ot_pd_sj"
  "23|/api/ortho_pediatric_v2/slipped_capital_femoral|ot_pd_scf"
  "24|/api/ortho_pediatric_v2/pediatric_fracture|ot_pd_pf"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1)
  URL=$(echo "$T" | cut -d'|' -f2)
  TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ortho_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
