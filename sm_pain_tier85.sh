#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/pain_acute_v2/acute_pain|pa_ap"
  "1|/api/pain_acute_v2/ed_pain|pa_ep"
  "2|/api/pain_acute_v2/trauma_pain|pa_tp"
  "3|/api/pain_acute_v2/cancer_pain|pa_cp"
  "4|/api/pain_acute_v2/post_op_pain_titrated|pa_pp"
  "5|/api/pain_chronic_v2/chronic_pain|pc_cr"
  "6|/api/pain_chronic_v2/opioid_chronic|pc_oc"
  "7|/api/pain_chronic_v2/pain_clinic|pc_pc"
  "8|/api/pain_chronic_v2/neuropathic_pain|pc_np"
  "9|/api/pain_chronic_v2/interventional_pain|pc_ip"
  "10|/api/pain_procedures_v2/epidural|pp_ep"
  "11|/api/pain_procedures_v2/rfa|pp_rf"
  "12|/api/pain_procedures_v2/surgical_implant|pp_si"
  "13|/api/pain_procedures_v2/joint_injection|pp_ji"
  "14|/api/pain_procedures_v2/trigger_point|pp_tp"
  "15|/api/pain_rehab_v2/pt_ot|pr_pt"
  "16|/api/pain_rehab_v2/tens|pr_tn"
  "17|/api/pain_rehab_v2/biofeedback|pr_bf"
  "18|/api/pain_rehab_v2/work_hardening|pr_wh"
  "19|/api/pain_rehab_v2/functional_restoration|pr_fr"
  "20|/api/pain_specialty_v2/headache_pain|ps_h"
  "21|/api/pain_specialty_v2/pelvic_pain|ps_p"
  "22|/api/pain_specialty_v2/cancer_pain_specialty|ps_cs"
  "23|/api/pain_specialty_v2/pediatric_pain|ps_pp"
  "24|/api/pain_specialty_v2/pain_psych|ps_py"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pain_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
