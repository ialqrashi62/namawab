#!/bin/bash
HOST="http://127.0.0.1:3000"
PASS=0; FAIL=0
run() {
  local url="$1"; local body="$2"; local name="$3"
  local code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$HOST$url" -H 'Content-Type: application/json' -d "$body")
  if [ "$code" = "200" ]; then echo "OK $name"; PASS=$((PASS+1));
  else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
echo "## SDOH"
for ep in housing food transport safety employ; do run "/api/sdoh_screen/$ep" '{"note":"x"}' "sdoh_screen/$ep"; done
for ep in realm teachback language education ehealth; do run "/api/sdoh_lit/$ep" '{"note":"x"}' "sdoh_lit/$ep"; done
for ep in insurance income debt citizenship counsel; do run "/api/sdoh_econ/$ep" '{"note":"x"}' "sdoh_econ/$ep"; done
for ep in moss caregiver oslo3 capacity crisis; do run "/api/sdoh_sup/$ep" '{"note":"x"}' "sdoh_sup/$ep"; done
for ep in katz lawton whodas pedi fim; do run "/api/sdoh_func/$ep" '{"note":"x"}' "sdoh_func/$ep"; done
for ep in match make track privacy handoff; do run "/api/sdoh_ref/$ep" '{"note":"x"}' "sdoh_ref/$ep"; done

echo "## FORENSIC"
for ep in register dc autopsy chain writing; do run "/api/forensic_mlc/$ep" '{"note":"x"}' "forensic_mlc/$ep"; done
for ep in examination evidence wound; do run "/api/forensic_sa/$ep" '{"note":"x"}' "forensic_sa/$ep"; done
for ep in work compensation disability; do run "/api/forensic_work/$ep" '{"note":"x"}' "forensic_work/$ep"; done
for ep in intake documentation; do run "/api/forensic_doc/$ep" '{"note":"x"}' "forensic_doc/$ep"; done
for ep in court testimony subpoena; do run "/api/forensic_court/$ep" '{"note":"x"}' "forensic_court/$ep"; done
for ep in ethic consult; do run "/api/forensic_ethic/$ep" '{"note":"x"}' "forensic_ethic/$ep"; done

echo "## GENOMICS"
for ep in screen manage; do run "/api/genobrca/$ep" '{"note":"x"}' "genobrca/$ep"; done
run "/api/genopgx/pgx" '{"note":"x"}' "genopgx/pgx"
run "/api/genopren/cvs" '{"note":"x"}' "genopren/cvs"
run "/api/genocar/carrier" '{"note":"x"}' "genocar/carrier"
run "/api/genonbs/result" '{"note":"x"}' "genonbs/result"
run "/api/genotrio/indication" '{"note":"x"}' "genotrio/indication"

echo "## INTEG"
for ep in hook_patient_view hook_order_sign hook_medication_prescribe; do run "/api/integ_cds/$ep" '{"note":"x"}' "integ_cds/$ep"; done
run "/api/integ_fhir/patient" '{"note":"x"}' "integ_fhir/patient"
run "/api/integ_hl7/msg" '{"note":"x"}' "integ_hl7/msg"
run "/api/integ_ter/lookup" '{"note":"x"}' "integ_ter/lookup"
run "/api/integ_cpl/care" '{"note":"x"}' "integ_cpl/care"
run "/api/integ_ctn/handoff" '{"note":"x"}' "integ_ctn/handoff"

echo "## OPS"
run "/api/ops_ext/cmd" '{"note":"x"}' "ops_ext/cmd"
run "/api/ops_bed/bed" '{"note":"x"}' "ops_bed/bed"
run "/api/ops_staff/staff" '{"note":"x"}' "ops_staff/staff"
run "/api/ops_qual/qual" '{"note":"x"}' "ops_qual/qual"
run "/api/ops_acc/acc" '{"note":"x"}' "ops_acc/acc"
run "/api/ops_inc/inc" '{"note":"x"}' "ops_inc/inc"
run "/api/ops_audit/audit" '{"note":"x"}' "ops_audit/audit"

echo "## PAIN"
run "/api/pain_c/chronic" '{"note":"x"}' "pain_c/chronic"
run "/api/pain_a/acute" '{"note":"x"}' "pain_a/acute"
run "/api/pain_cx/cancer" '{"note":"x"}' "pain_cx/cancer"
run "/api/pain_h/headache" '{"note":"x"}' "pain_h/headache"
run "/api/pain_p/palliative" '{"note":"x"}' "pain_p/palliative"
run "/api/pain_e/eol" '{"note":"x"}' "pain_e/eol"

echo "## PHARM"
run "/api/ph_rc/recon" '{"note":"x"}' "ph_rc/recon"
run "/api/ph_sw/steward" '{"note":"x"}' "ph_sw/steward"
run "/api/ph_in/interact" '{"note":"x"}' "ph_in/interact"
run "/api/ph_to/tox" '{"note":"x"}' "ph_to/tox"
run "/api/ph_pe/peds" '{"note":"x"}' "ph_pe/peds"
run "/api/ph_on/onc" '{"note":"x"}' "ph_on/onc"

echo "## RARE"
run "/api/rare_dis/disease" '{"note":"x"}' "rare_dis/disease"
run "/api/rare_gen/genetic" '{"note":"x"}' "rare_gen/genetic"
run "/api/rare_rehab/rehab" '{"note":"x"}' "rare_rehab/rehab"
run "/api/rare_pro/prom" '{"note":"x"}' "rare_pro/prom"
run "/api/rare_res/research" '{"note":"x"}' "rare_res/research"
run "/api/rare_imm/immune" '{"note":"x"}' "rare_imm/immune"

echo "## SURG_SPEC"
run "/api/surg_spec_ct/cardiothoracic" '{"note":"x"}' "surg_spec_ct/cardiothoracic"
run "/api/surg_spec_ns/neurosurg" '{"note":"x"}' "surg_spec_ns/neurosurg"
run "/api/surg_spec_vs/vascular" '{"note":"x"}' "surg_spec_vs/vascular"
run "/api/surg_spec_tr/transplant" '{"note":"x"}' "surg_spec_tr/transplant"
run "/api/surg_spec_pl/plastic" '{"note":"x"}' "surg_spec_pl/plastic"
run "/api/surg_spec_pd/pedsurg" '{"note":"x"}' "surg_spec_pd/pedsurg"

echo "## REHAB"
run "/api/rehab_assess/assess" '{"note":"x"}' "rehab_assess/assess"
run "/api/rehab_treat/treat" '{"note":"x"}' "rehab_treat/treat"
run "/api/rehab_outc/outc" '{"note":"x"}' "rehab_outc/outc"
run "/api/rehab_complex/complex" '{"note":"x"}' "rehab_complex/complex"
run "/api/rehab_prosth/prosthetic" '{"note":"x"}' "rehab_prosth/prosthetic"
run "/api/rehab_discharge/discharge" '{"note":"x"}' "rehab_discharge/discharge"

echo "## IMAGING"
run "/api/imus/us" '{"note":"x"}' "imus/us"
run "/api/imct/ct" '{"note":"x"}' "imct/ct"
run "/api/immri/mri" '{"note":"x"}' "immri/mri"
run "/api/imir/ir" '{"note":"x"}' "imir/ir"
run "/api/imnuc/nuc" '{"note":"x"}' "imnuc/nuc"
run "/api/immam/mammo" '{"note":"x"}' "immam/mammo"

echo "## INFUSION"
run "/api/in_iv/iv" '{"note":"x"}' "in_iv/iv"
run "/api/in_pc/pca" '{"note":"x"}' "in_pc/pca"
run "/api/in_ch/chemo" '{"note":"x"}' "in_ch/chemo"
run "/api/in_is/insulin" '{"note":"x"}' "in_is/insulin"
run "/api/in_ho/home" '{"note":"x"}' "in_ho/home"
run "/api/in_sp/specialty" '{"note":"x"}' "in_sp/specialty"

echo "## DENTAL"
run "/api/dent_car/caries" '{"note":"x"}' "dent_car/caries"
run "/api/dent_per/perio" '{"note":"x"}' "dent_per/perio"
run "/api/dent_orth/ortho" '{"note":"x"}' "dent_orth/ortho"
run "/api/dent_endo/endo" '{"note":"x"}' "dent_endo/endo"
run "/api/dent_pros/pros" '{"note":"x"}' "dent_pros/pros"
run "/api/dent_max/max" '{"note":"x"}' "dent_max/max"

echo "## ADDICTION"
run "/api/add_scr/screen" '{"note":"x"}' "add_scr/screen"
run "/api/add_det/detox" '{"note":"x"}' "add_det/detox"
run "/api/add_mat/mat" '{"note":"x"}' "add_mat/mat"
run "/api/add_bhv/behavior" '{"note":"x"}' "add_bhv/behavior"
run "/api/add_hrm/harm" '{"note":"x"}' "add_hrm/harm"
run "/api/add_rec/recovery" '{"note":"x"}' "add_rec/recovery"

echo ""
echo "PASS=$PASS FAIL=$FAIL"