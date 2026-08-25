#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier174_hem_811_anemia_fup
chk tier174_hem_811_bmt_fup
chk tier174_hem_811_coag_fup
chk tier174_hem_811_leukemia_fup
chk tier174_hem_811_lymphoma_fup
chk tier174_onc_812_cancer_staging
chk tier174_onc_812_clinical_trial
chk tier174_onc_812_path_review
chk tier174_onc_812_survivorship_fup
chk tier174_onc_812_tumor_board
chk tier174_car_813_cad_follow
chk tier174_car_813_echo_followup
chk tier174_car_813_icd_follow
chk tier174_car_813_pacemaker_check
chk tier174_car_813_valve_fup
chk tier174_nep_814_ckd_follow
chk tier174_nep_814_dialysis_eval
chk tier174_nep_814_htn_renal
chk tier174_nep_814_renal_biopsy
chk tier174_nep_814_transplant_fup
chk tier174_pal_815_death_review
chk tier174_pal_815_family_meeting
chk tier174_pal_815_pain_pump
chk tier174_pal_815_palliative_visit
chk tier174_pal_815_spiritual_care
echo "TOTALS: pass=$pass fail=$fail"
