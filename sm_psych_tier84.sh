#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/psych_general_v2/psych_eval|pg_e"
  "1|/api/psych_general_v2/intake|pg_i"
  "2|/api/psych_general_v2/med_management|pg_mm"
  "3|/api/psych_general_v2/psychotherapy|pg_pt"
  "4|/api/psych_general_v2/discharge|pg_d"
  "5|/api/psych_anxiety_v2/anxiety_screen|pa_s"
  "6|/api/psych_anxiety_v2/ocd_eval|pa_o"
  "7|/api/psych_anxiety_v2/ptsd|pa_p"
  "8|/api/psych_anxiety_v2/panic|pa_pa"
  "9|/api/psych_anxiety_v2/social_anxiety|pa_sa"
  "10|/api/psych_mood_v2/depression|pm_d"
  "11|/api/psych_mood_v2/bipolar|pm_b"
  "12|/api/psych_mood_v2/pms_pmdd|pm_pp"
  "13|/api/psych_mood_v2/postpartum|pm_po"
  "14|/api/psych_mood_v2/seasonal|pm_se"
  "15|/api/psych_sud_v2/alcohol|ps_a"
  "16|/api/psych_sud_v2/opioid|ps_o"
  "17|/api/psych_sud_v2/cannabis|ps_c"
  "18|/api/psych_sud_v2/stimulant|ps_s"
  "19|/api/psych_sud_v2/dual_diagnosis|ps_dd"
  "20|/api/psych_emerg_v2/suicidal|pe_s"
  "21|/api/psych_emerg_v2/psych_emerg_eval|pe_pe"
  "22|/api/psych_emerg_v2/restraint|pe_r"
  "23|/api/psych_emerg_v2/psychosis|pe_py"
  "24|/api/psych_emerg_v2/crisis|pe_cr"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ps_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
