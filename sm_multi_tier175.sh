#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier175_eye_816_cataract_eval
chk tier175_eye_816_glaucoma_follow
chk tier175_eye_816_macular_degen
chk tier175_eye_816_pediatric_eye
chk tier175_eye_816_retinal_detach
chk tier175_ent_817_hearing_aid_fit
chk tier175_ent_817_sinusitis_eval
chk tier175_ent_817_tinnitus_eval
chk tier175_ent_817_vertigo_eval
chk tier175_ent_817_voice_disorder
chk tier175_ski_818_cryotherapy
chk tier175_ski_818_derm_eval
chk tier175_ski_818_excision
chk tier175_ski_818_patch_test
chk tier175_ski_818_skin_biopsy
chk tier175_mus_819_lupus_follow
chk tier175_mus_819_myositis_follow
chk tier175_mus_819_ra_follow
chk tier175_mus_819_scleroderma_follow
chk tier175_mus_819_vasculitis_follow
chk tier175_psy_820_anxiety_screen
chk tier175_psy_820_bipolar_follow
chk tier175_psy_820_depression_screen
chk tier175_psy_820_ptsd_screen
chk tier175_psy_820_schizophrenia_follow
echo "TOTALS: pass=$pass fail=$fail"
