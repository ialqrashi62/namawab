#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier172_bun_799_epidural
chk tier172_bun_799_multimodal
chk tier172_bun_799_nerve_block
chk tier172_bun_799_pain_evaluation
chk tier172_bun_799_pca_pump
chk tier172_neu_802_epilepsy_follow
chk tier172_neu_802_migraine
chk tier172_neu_802_ms_follow
chk tier172_neu_802_parkinson_follow
chk tier172_neu_802_stroke_follow
chk tier172_bre_803_breast_dx
chk tier172_bre_803_breast_recon
chk tier172_bre_803_breast_screen
chk tier172_bre_803_breast_surgery
chk tier172_bre_803_breast_survivorship
chk tier172_gyn_804_cervical_screen
chk tier172_gyn_804_endometrial_biopsy
chk tier172_gyn_804_hysterectomy
chk tier172_gyn_804_oophorectomy
chk tier172_gyn_804_ovarian_screen
chk tier172_car_805_arrhythmia
chk tier172_car_805_cardiac_rehab
chk tier172_car_805_heart_failure
chk tier172_car_805_pci
chk tier172_car_805_valve_surgery
echo "TOTALS: pass=$pass fail=$fail"
