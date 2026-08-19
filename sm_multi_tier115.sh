#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/neurosurgery_v2/craniotomy|ns_0"
  "1|/api/neurosurgery_v2/spine_fusion|ns_1"
  "2|/api/neurosurgery_v2/tumor_resection|ns_2"
  "3|/api/neurosurgery_v2/vp_shunt|ns_3"
  "4|/api/neurosurgery_v2/cervical_decompression|ns_4"
  "5|/api/orthopedics_ext_v2/joint_replacement|or_5"
  "6|/api/orthopedics_ext_v2/arthroscopy|or_6"
  "7|/api/orthopedics_ext_v2/fracture_fixation|or_7"
  "8|/api/orthopedics_ext_v2/spinal_decompression|or_8"
  "9|/api/orthopedics_ext_v2/ligament_repair|or_9"
  "10|/api/otolaryngology_v2/sinus_surgery|ot_10"
  "11|/api/otolaryngology_v2/hearing_aid|ot_11"
  "12|/api/otolaryngology_v2/cochlear_implant|ot_12"
  "13|/api/otolaryngology_v2/tonsillectomy|ot_13"
  "14|/api/otolaryngology_v2/thyroidectomy|ot_14"
  "15|/api/ophthalmology_v2/cataract_surgery|op_15"
  "16|/api/ophthalmology_v2/retinal_detachment|op_16"
  "17|/api/ophthalmology_v2/glaucoma_surgery|op_17"
  "18|/api/ophthalmology_v2/refractive_surgery|op_18"
  "19|/api/ophthalmology_v2/corneal_transplant|op_19"
  "20|/api/dentistry_v2/extraction|de_20"
  "21|/api/dentistry_v2/root_canal|de_21"
  "22|/api/dentistry_v2/implant|de_22"
  "23|/api/dentistry_v2/orthodontic|de_23"
  "24|/api/dentistry_v2/periodontal|de_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"