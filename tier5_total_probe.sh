#!/bin/bash
# Comprehensive probe: scan ALL tier5_ext mounts and try placeholder bodies
HOST="http://127.0.0.1:3000"
PASS=0; FAIL=0; NOT_FOUND=0
echo "=== Tier5_EXT wave probe ==="

probe() {
  local label="$1"; local url="$2"; local body="$3"
  local code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$HOST$url" -H 'Content-Type: application/json' -d "$body")
  if [ "$code" = "200" ]; then echo "OK   $label ($code) $url"; PASS=$((PASS+1))
  elif [ "$code" = "400" ]; then echo "OK   $label ($code val) $url"; PASS=$((PASS+1))
  elif [ "$code" = "404" ]; then NOT_FOUND=$((NOT_FOUND+1))
  else echo "FAIL $label ($code) $url"; FAIL=$((FAIL+1))
  fi
}

# SDOH
probe "sdoh_screen/housing" "/api/sdoh_screen/housing" '{"living_situation":"stable"}'
probe "sdoh_screen/food" "/api/sdoh_screen/food" '{"food_insecurity":false}'
probe "sdoh_screen/transport" "/api/sdoh_screen/transport" '{"transport_barriers":false}'
probe "sdoh_screen/safety" "/api/sdoh_screen/safety" '{"safety_concern":false}'
probe "sdoh_screen/employ" "/api/sdoh_screen/employ" '{"unemployed":false}'
probe "sdoh_lit/realm" "/api/sdoh_lit/realm" '{"realm_score":8}'
probe "sdoh_lit/teachback" "/api/sdoh_lit/teachback" '{"teach_back":true}'
probe "sdoh_lit/language" "/api/sdoh_lit/language" '{"language_english":true}'
probe "sdoh_lit/education" "/api/sdoh_lit/education" '{"education_level":"high"}'
probe "sdoh_lit/ehealth" "/api/sdoh_lit/ehealth" '{"ehealth_access":true}'
probe "sdoh_econ/assessment" "/api/sdoh_econ/assessment" '{"financial_strain":false}'
probe "sdoh_sup/support" "/api/sdoh_sup/support" '{"social_support":true}'
probe "sdoh_func/functional" "/api/sdoh_func/functional" '{"activity_daily_living":5}'
probe "sdoh_ref/community" "/api/sdoh_ref/community" '{"community_resources":true}'

# Forensic
probe "forensic_mlc/register" "/api/forensic_mlc/register" '{"case_type":"unknown_deceased"}'
probe "forensic_mlc/dc" "/api/forensic_mlc/dc" '{"death_certificate":true}'
probe "forensic_mlc/autopsy" "/api/forensic_mlc/autopsy" '{"autopsy_required":false}'
probe "forensic_mlc/chain" "/api/forensic_mlc/chain" '{"chain_of_custody":true}'
probe "forensic_mlc/writing" "/api/forensic_mlc/writing" '{"medico_legal_writing":true}'
probe "forensic_sa/examination" "/api/forensic_sa/examination" '{"consent":true,"age":30}'
probe "forensic_work/work" "/api/forensic_work/work" '{"fitness_to_work":true}'
probe "forensic_doc/intake" "/api/forensic_doc/intake" '{"brought_dead":true}'
probe "forensic_court/court" "/api/forensic_court/court" '{"court_order":true}'
probe "forensic_ethic/ethic" "/api/forensic_ethic/ethic" '{"ethics_consult":true}'

# Genomics
probe "genobrca/screen" "/api/genobrca/screen" '{"age":40,"family_history":true,"ashkenazi":false}'
probe "genobrca/manage" "/api/genobrca/manage" '{"brca_positive":true}'
probe "genopgx/pgx" "/api/genopgx/pgx" '{"drug_name":"warfarin","germline_test":true}'
probe "genopren/cvs" "/api/genopren/cvs" '{"indication":"positive_screen","consent":true}'
probe "genocar/carrier" "/api/genocar/carrier" '{"disease":"cystic_fibrosis","preconception":true}'
probe "genonbs/result" "/api/genonbs/result" '{"newborn_age_hours":48,"screen_positive":false}'
probe "genotrio/indication" "/api/genotrio/indication" '{"age":5,"developmental_delay":true}'

# Integ
probe "integ_cds/hook_patient_view" "/api/integ_cds/hook_patient_view" '{"patient_id":"p1"}'
probe "integ_cds/hook_order_sign" "/api/integ_cds/hook_order_sign" '{"order_id":"o1"}'
probe "integ_cds/hook_medication_prescribe" "/api/integ_cds/hook_medication_prescribe" '{"drug":"warfarin"}'
probe "integ_fhir/patient" "/api/integ_fhir/patient" '{"resourceType":"Patient","id":"p1"}'
probe "integ_hl7/msg" "/api/integ_hl7/msg" '{"triggerevent":"A01","patient_id":"p1"}'
probe "integ_ter/lookup" "/api/integ_ter/lookup" '{"code":"E11.9","system":"ICD-10"}'
probe "integ_cpl/care" "/api/integ_cpl/care" '{"patient_id":"p1","goal":"reduce_BP"}'
probe "integ_ctn/handoff" "/api/integ_ctn/handoff" '{"from_facility":"hosp1","to_facility":"hosp2"}'

# OPS
probe "ops_ext/cmd" "/api/ops_ext/cmd" '{"command":"status"}'
probe "ops_bed/bed" "/api/ops_bed/bed" '{"bed_id":"b1"}'
probe "ops_staff/staff" "/api/ops_staff/staff" '{"staff_id":"s1"}'
probe "ops_qual/qual" "/api/ops_qual/qual" '{"quality_metric":"readmission_rate"}'
probe "ops_acc/acc" "/api/ops_acc/acc" '{"accreditation":"CBAHI"}'
probe "ops_inc/inc" "/api/ops_inc/inc" '{"incident_id":"i1"}'
probe "ops_audit/audit" "/api/ops_audit/audit" '{"audit_target":"finance"}'

# Pain
probe "pain_c/chronic" "/api/pain_c/chronic" '{"pain_duration_months":6}'
probe "pain_a/acute" "/api/pain_a/acute" '{"postop_day":2}'
probe "pain_cx/cancer" "/api/pain_cx/cancer" '{"cancer_pain":true}'
probe "pain_h/headache" "/api/pain_h/headache" '{"headache_type":"migraine"}'
probe "pain_p/palliative" "/api/pain_p/palliative" '{"palliative_pain":true}'
probe "pain_e/eol" "/api/pain_e/eol" '{"end_of_life_pain":true}'

# Pharm
probe "ph_rc/recon" "/api/ph_rc/recon" '{"meds_reconciled":true}'
probe "ph_sw/steward" "/api/ph_sw/steward" '{"antimicrobial_stewardship":true}'
probe "ph_in/interact" "/api/ph_in/interact" '{"drug1":"warfarin","drug2":"aspirin"}'
probe "ph_to/tox" "/api/ph_to/tox" '{"toxicology_review":true}'
probe "ph_pe/peds" "/api/ph_pe/peds" '{"pediatric_dose_check":true}'
probe "ph_on/onc" "/api/ph_on/onc" '{"chemo_premed":true}'

# Rare
probe "rare_dis/disease" "/api/rare_dis/disease" '{"rare_disease":"huntington"}'
probe "rare_gen/genetic" "/api/rare_gen/genetic" '{"genetic_test":true}'
probe "rare_rehab/rehab" "/api/rare_rehab/rehab" '{"rehabilitation_plan":true}'
probe "rare_pro/prom" "/api/rare_pro/prom" '{"enrollment":true}'
probe "rare_res/research" "/api/rare_res/research" '{"research_protocol":true}'
probe "rare_imm/immune" "/api/rare_imm/immune" '{"immune_dysfunction":true}'

# Surg_spec
probe "surg_spec_ct/cardiothoracic" "/api/surg_spec_ct/cardiothoracic" '{"cabg_required":true}'
probe "surg_spec_ns/neurosurg" "/api/surg_spec_ns/neurosurg" '{"craniotomy":true}'
probe "surg_spec_vs/vascular" "/api/surg_spec_vs/vascular" '{"vascular_anastomosis":true}'
probe "surg_spec_tr/transplant" "/api/surg_spec_tr/transplant" '{"transplant_type":"kidney"}'
probe "surg_spec_pl/plastic" "/api/surg_spec_pl/plastic" '{"reconstruction":true}'
probe "surg_spec_pd/pedsurg" "/api/surg_spec_pd/pedsurg" '{"pediatric_surgery":true}'

# Rehab
probe "rehab_assess/assess" "/api/rehab_assess/assess" '{"functional_score":70}'
probe "rehab_treat/treat" "/api/rehab_treat/treat" '{"pt_started":true}'
probe "rehab_outc/outc" "/api/rehab_outc/outc" '{"improvement":true}'
probe "rehab_complex/complex" "/api/rehab_complex/complex" '{"multidisciplinary":true}'
probe "rehab_prosth/prosthetic" "/api/rehab_prosth/prosthetic" '{"prosthetic_type":"leg"}'
probe "rehab_discharge/discharge" "/api/rehab_discharge/discharge" '{"discharge_plan":true}'

# Imaging (already verified but probe)
probe "imus/us" "/api/imus/us" '{"study":"abdominal"}'
probe "imct/ct" "/api/imct/ct" '{"study":"head"}'
probe "immri/mri" "/api/immri/mri" '{"study":"brain"}'
probe "imir/ir" "/api/imir/ir" '{"procedure":"biopsy"}'
probe "imnuc/nuc" "/api/imnuc/nuc" '{"study":"bone"}'
probe "immam/mammo" "/api/immam/mammo" '{"study":"screening"}'

# Infusion
probe "in_iv/iv" "/api/in_iv/iv" '{"catheter_type":"PICC"}'
probe "in_pc/pca" "/api/in_pc/pca" '{"pca_pump":true}'
probe "in_ch/chemo" "/api/in_ch/chemo" {'"drug":"cisplatin"}'
probe "in_is/insulin" "/api/in_is/insulin" '{"insulin_dose":10}'
probe "in_ho/home" "/api/in_ho/home" '{"home_infusion":true}'
probe "in_sp/specialty" "/api/in_sp/specialty" '{"specialty_drug":"remicade"}'

# Dental
probe "dent_car/caries" "/api/dent_car/caries" '{"decay_present":true}'
probe "dent_per/perio" "/api/dent_per/perio" '{"bleeding_on_probing":true}'
probe "dent_orth/ortho" "/api/dent_orth/ortho" '{"malocclusion":true}'
probe "dent_endo/endo" "/api/dent_endo/endo" '{"pulpitis":true}'
probe "dent_pros/pros" "/api/dent_pros/pros" '{"missing_teeth":3}'
probe "dent_max/max" "/api/dent_max/max" '{"facial_fracture":false}'

# Addiction
probe "add_scr/screen" "/api/add_scr/screen" '{"audit_c":3}'
probe "add_det/detox" "/api/add_det/detox" '{"alcohol_withdrawal":true}'
probe "add_mat/mat" "/api/add_mat/mat" '{"medication_assisted":true}'
probe "add_bhv/behavior" "/api/add_bhv/behavior" '{"behavioral_therapy":true}'
probe "add_hrm/harm" "/api/add_hrm/harm" '{"harm_reduction":true}'
probe "add_rec/recovery" "/api/add_rec/recovery" '{"recovery_plan":true}'

echo ""
echo "ALIVE=$PASS  BROKEN=$FAIL  NOT_FOUND=$NOT_FOUND"