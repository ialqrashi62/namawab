#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/ent_general_v2/ent_clinic|en_gen"
  "1|/api/ent_general_v2/audiometry|en_aud"
  "2|/api/ent_general_v2/hearing_aid|en_ha"
  "3|/api/ent_general_v2/cochlear_impl|en_ci"
  "4|/api/ent_general_v2/ent_referral|en_ref"
  "5|/api/ent_sinus_v2/sinusitis_eval|en_sin_e"
  "6|/api/ent_sinus_v2/sinus_surgery|en_sin_s"
  "7|/api/ent_sinus_v2/allergic_rhinitis|en_ar"
  "8|/api/ent_sinus_v2/epistaxis|en_ep"
  "9|/api/ent_sinus_v2/nasal_endoscopy|en_ne"
  "10|/api/ent_throat_v2/tonsillitis|en_to"
  "11|/api/ent_throat_v2/tonsillectomy|en_tl"
  "12|/api/ent_throat_v2/obstructive_sleep_apnea|en_osa"
  "13|/api/ent_throat_v2/laryngitis_reflux|en_lr"
  "14|/api/ent_throat_v2/voice_therapy|en_vt"
  "15|/api/ent_head_neck_v2/thyroid_nodule|en_tn"
  "16|/api/ent_head_neck_v2/thyroidectomy|en_th"
  "17|/api/ent_head_neck_v2/neck_mass|en_nm"
  "18|/api/ent_head_neck_v2/salivary_gland|en_sg"
  "19|/api/ent_head_neck_v2/head_neck_cancer|en_hnc"
  "20|/api/ent_pediatric_v2/otitis_media|en_om"
  "21|/api/ent_pediatric_v2/myringotomy|en_my"
  "22|/api/ent_pediatric_v2/adenoidectomy|en_ad"
  "23|/api/ent_pediatric_v2/newborn_hearing|en_nh"
  "24|/api/ent_pediatric_v2/congenital_neck_mass|en_cnm"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1)
  URL=$(echo "$T" | cut -d'|' -f2)
  TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
