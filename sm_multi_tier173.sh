#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier173_pul_806_asthma_eval
chk tier173_pul_806_copd_eval
chk tier173_pul_806_home_oxygen
chk tier173_pul_806_sleep_study
chk tier173_pul_806_tb_screening
chk tier173_skp_807_hip_replace
chk tier173_skp_807_knee_replace
chk tier173_skp_807_shoulder_replace
chk tier173_skp_807_spine_surgery
chk tier173_skp_807_sports_surgery
chk tier173_mus_808_amputation
chk tier173_mus_808_bone_biopsy
chk tier173_mus_808_car_accident
chk tier173_mus_808_cast_management
chk tier173_mus_808_external_fixation
chk tier173_mus_808_fracture_assess
chk tier173_int_809_endoscopy_followup
chk tier173_int_809_gi_bleed
chk tier173_int_809_ibd_flare
chk tier173_int_809_liver_cirrhosis
chk tier173_int_809_transplant_eval
chk tier173_ped_810_autism_screen
chk tier173_ped_810_childhood_vaccine
chk tier173_ped_810_feeding_eval
chk tier173_ped_810_growth_failure
chk tier173_ped_810_neonatal_screenal
echo "TOTALS: pass=$pass fail=$fail"
