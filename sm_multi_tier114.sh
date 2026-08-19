#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/anxiety_v2/gad|an_0"
  "1|/api/anxiety_v2/panic_disorder|an_1"
  "2|/api/anxiety_v2/social_anxiety|an_2"
  "3|/api/anxiety_v2/phobia|an_3"
  "4|/api/anxiety_v2/separation_anxiety|an_4"
  "5|/api/mood_v2/mdd|mo_5"
  "6|/api/mood_v2/bipolar|mo_6"
  "7|/api/mood_v2/dysthymia|mo_7"
  "8|/api/mood_v2/seasonal_affective|mo_8"
  "9|/api/mood_v2/mixed_features|mo_9"
  "10|/api/psychotic_v2/schizophrenia|ps_10"
  "11|/api/psychotic_v2/schizoaffective|ps_11"
  "12|/api/psychotic_v2/brief_psychotic|ps_12"
  "13|/api/psychotic_v2/delusional|ps_13"
  "14|/api/psychotic_v2/substance_induced_psychotic|ps_14"
  "15|/api/trauma_v2/ptsd|tr_15"
  "16|/api/trauma_v2/acute_stress|tr_16"
  "17|/api/trauma_v2/adjustment|tr_17"
  "18|/api/trauma_v2/complex_trauma|tr_18"
  "19|/api/trauma_v2/bereavement_reaction|tr_19"
  "20|/api/substance_use_v2/alcohol_use|su_20"
  "21|/api/substance_use_v2/opioid_use|su_21"
  "22|/api/substance_use_v2/stimulant_use|su_22"
  "23|/api/substance_use_v2/cannabis_use|su_23"
  "24|/api/substance_use_v2/sedative_use|su_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"