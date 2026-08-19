#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/rheumatoid_v2/ra_assessment|ra_1"
  "1|/api/rheumatoid_v2/ra_treatment|ra_2"
  "2|/api/rheumatoid_v2/ra_monitoring|ra_3"
  "3|/api/rheumatoid_v2/ra_imaging|ra_4"
  "4|/api/rheumatoid_v2/ra_surgery|ra_5"
  "5|/api/spondyloarthropathy_v2/ankylosing_spondylitis|sp_1"
  "6|/api/spondyloarthropathy_v2/psoriatic_arthritis|sp_2"
  "7|/api/spondyloarthropathy_v2/ibd_arthritis|sp_3"
  "8|/api/spondyloarthropathy_v2/reactive_arthritis|sp_4"
  "9|/api/spondyloarthropathy_v2/enthesitis|sp_5"
  "10|/api/crystal_arthritis_v2/gout_acute|ca_1"
  "11|/api/crystal_arthritis_v2/gout_chronic|ca_2"
  "12|/api/crystal_arthritis_v2/cppd|ca_3"
  "13|/api/crystal_arthritis_v2/basic_calcium_phosphate|ca_4"
  "14|/api/crystal_arthritis_v2/crystal_synovial|ca_5"
  "15|/api/connective_tissue_v2/sle_diagnosis|ct_1"
  "16|/api/connective_tissue_v2/ssc_diagnosis|ct_2"
  "17|/api/connective_tissue_v2/sjs_diagnosis|ct_3"
  "18|/api/connective_tissue_v2/myositis_diagnosis|ct_4"
  "19|/api/connective_tissue_v2/overlap_syndromes|ct_5"
  "20|/api/vasculitis_v2/gca|va_1"
  "21|/api/vasculitis_v2/takayasu|va_2"
  "22|/api/vasculitis_v2/anca_vasculitis|va_3"
  "23|/api/vasculitis_v2/polyarteritis|va_4"
  "24|/api/vasculitis_v2/secondary_vasculitis|va_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
