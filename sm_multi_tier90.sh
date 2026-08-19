#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/genetics_cancer_v2/cancer_genetic_counseling|gc_1"
  "1|/api/genetics_cancer_v2/brca_counseling|gc_2"
  "2|/api/genetics_cancer_v2/lynch_syndrome|gc_3"
  "3|/api/genetics_cancer_v2/prenatal_genetics|gc_4"
  "4|/api/genetics_cancer_v2/carrier_screening|gc_5"
  "5|/api/genetics_rare_v2/rare_disease_workup|gr_1"
  "6|/api/genetics_rare_v2/whole_exome|gr_2"
  "7|/api/genetics_rare_v2/metabolic_genetics|gr_3"
  "8|/api/genetics_rare_v2/newborn_screening|gr_4"
  "9|/api/genetics_rare_v2/pharmacogenomics|gr_5"
  "10|/api/genetics_adult_v2/family_history|ga_1"
  "11|/api/genetics_adult_v2/predictive_testing|ga_2"
  "12|/api/genetics_adult_v2/cardiovascular_genetics|ga_3"
  "13|/api/genetics_adult_v2/neurogenetics|ga_4"
  "14|/api/genetics_adult_v2/genetic_followup|ga_5"
  "15|/api/genetics_counseling_v2/pretest_counseling|gc_1"
  "16|/api/genetics_counseling_v2/results_disclosure|gc_2"
  "17|/api/genetics_counseling_v2/psychosocial_support|gc_3"
  "18|/api/genetics_counseling_v2/cascade_screening|gc_4"
  "19|/api/genetics_counseling_v2/reproductive_counseling|gc_5"
  "20|/api/genetics_lab_v2/karyotype|gl_1"
  "21|/api/genetics_lab_v2/microarray|gl_2"
  "22|/api/genetics_lab_v2/variant_interpretation|gl_3"
  "23|/api/genetics_lab_v2/fish_test|gl_4"
  "24|/api/genetics_lab_v2/methylation_test|gl_5"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
