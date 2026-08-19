// filepath: gen_tier87.js
const fs = require('fs');
const path = require('path');

const mods = [
  { name: 'neph_general', eng: 458, base: 0,
    eps: ['neph_clinic','ckd_eval','ckd_followup','glomerulonephritis','polycystic_kidney'] },
  { name: 'neph_dialysis', eng: 459, base: 5,
    eps: ['hemodialysis_initial','hemodialysis_followup','dialysis_adequacy','electrolyte_management','dry_weight'] },
  { name: 'neph_nephrology', eng: 460, base: 10,
    eps: ['hypertension_renal','proteinuria_hematuria','renal_stones','renal_cyst','proteinuric_disease'] },
  { name: 'neph_geri', eng: 461, base: 15,
    eps: ['geri_neph','elderly_ckd','gentiurian_dialysis','nephro_epidemic','nephro_global'] },
  { name: 'neph_advanced', eng: 462, base: 20,
    eps: ['peritoneal_dialysis','transplant_clinic','dialysis_vascular_access','anemia_ckd','bone_metabolism_ckd'] }
];

const bodies = [
  // 0 neph_clinic
  {patient_id:'N0',visit_id:'nv_00',primary_diagnosis:'ckd_stage_3',visit_type:'new',consulting_provider:'neph',symptoms:'edema',bp_systolic:140,bp_diastolic:85,weight_kg:82,creatinine:1.6,gfr:50,potassium:4.5,medications:'losartan',provider:'neph_001',next_review:90},
  // 1 ckd_eval
  {patient_id:'N1',assessment_id:'na_01',age:55,ckd_etiology:'diabetes',creatinine:1.4,gfr_calculated:55,egfr:60,urine_acr:300,ultrasound_done:true,kidney_size:'normal',cyst_present:false,family_history:'ckd',provider:'neph_001',next_review:90},
  // 2 ckd_followup
  {patient_id:'N2',visit_id:'nv_02',creatinine:1.5,gfr:50,egfr:55,urine_acr:200,bp_systolic:130,bp_diastolic:80,potassium:4.5,ace_inhibitor:1,statin:1,bicarbonate:25,provider:'neph_001',next_review:90},
  // 3 glomerulonephritis
  {patient_id:'N3',assessment_id:'na_03',biopsy_done:true,biopsy_diagnosis:'iga',proteinuria_g:2.5,creatinine:1.8,gfr:45,hematuria_present:true,complement_low:true,steroids_started:true,immunosuppression:'mMF_prednisone',prognosis:'moderate',provider:'neph_001',next_review:30},
  // 4 polycystic_kidney
  {patient_id:'N4',assessment_id:'na_04',family_history:true,disease_stage:'crisp_3',creatinine:1.5,gfr:50,kidney_size_l:16,kidney_size_r:15,cyst_count_left:8,cyst_count_right:7,liver_cysts:true,follow_up_weeks:24,provider:'neph_001',next_review:90},
  // 5 hemodialysis_initial
  {patient_id:'N5',assessment_id:'na_05',access_type:'av_fistula',age_dialysis_initiation:60,comorbidities:'diabetes',initial_dialysis_adequacy:'adequate',initial_kt_v:1.4,target_dry_weight:75,bp_pre_dialysis:160,hospitalization_count:2,transplant_evaluation:false,provider:'neph_001',next_review:14},
  // 6 hemodialysis_followup
  {patient_id:'N6',visit_id:'nv_06',kt_v:1.4,uv_reabs:200,fluid_removed_kg:2.5,bp_pre:155,bp_post:130,dry_weight_current:75,weight_post_dialysis:75,disposition:'improving',dialysis_vintage_years:2,provider:'neph_001',next_review:14},
  // 7 dialysis_adequacy
  {patient_id:'N7',visit_id:'nv_07',kt_v:1.4,urr:75,urea_reduction_ratio:75,normalized_protein_nitrogen_appearance:1.2,total_creatinine_output:50,albumin:3.6,dialysis_frequency:3,adequate_per_kdoqi:true,dialysis_vintage_years:3,provider:'neph_001',next_review:30},
  // 8 electrolyte_management
  {patient_id:'N8',visit_id:'nv_08',sodium:135,potassium:5.2,calcium:9.5,phosphorus:5.0,bicarbonate:22,magnesium:2.0,pth:450,corrected_calcium:9.5,dietary_compliance:'partial',provider:'neph_001',next_review:30},
  // 9 dry_weight
  {patient_id:'N9',visit_id:'nv_09',current_dry_weight:75,clinical_assessment:'edema_free',ibw_goal:75,previous_dry_weight:76,bp_with_dw:130,cramping_episodes:1,intradialytic_weight_gain:3,symptoms_following_dw:'none',provider:'neph_001',next_review:14},
  // 10 hypertension_renal
  {patient_id:'N10',visit_id:'nv_10',bp_systolic:155,bp_diastolic:95,creatinine:2.0,egfr:35,renin:10,aldosterone:18,secondary_cause_evaluated:true,renin_target:100,current_meds:'amlodipine',secondary_htn_ruleout:'no',provider:'neph_001',next_review:30},
  // 11 proteinuria_hematuria
  {patient_id:'N11',assessment_id:'na_11',proteinuria_g_day:3.5,urine_acr:3500,hematuria_present:true,rbc_casts_present:true,creatinine:1.4,egfr:55,blood_dipstick:'blood_3plus',protein_dipstick:'3plus',proteinuria_creatinine_ratio:3500,provider:'neph_001',next_review:30},
  // 12 renal_stones
  {patient_id:'N12',visit_id:'nv_12',type_of_stone:'calcium_oxalate',recurrent_stones:true,fluid_intake_l:2,family_history:true,stone_type_2:'uric_acid',stones_per_year:3,passed_count:2,imaging:'ct',provider:'neph_001',next_review:30},
  // 13 renal_cyst
  {patient_id:'N13',visit_id:'nv_13',cyst_classification:'bosniak_2',complexity:'simple',size_mm:25,follow_up:'no_followup',asymmetry:false,intervention_needed:false,risk_strat:'low',recommendation:'annual_us',provider:'neph_001',next_review:52},
  // 14 proteinuric_disease
  {patient_id:'N14',visit_id:'nv_14',proteinuria_g_day:5,creatinine:2.4,egfr:35,serum_albumin:2.5,edema_severity:'severe',statin_start:1,acei_started:1,diuretic:1,follow_up_weeks:4,provider:'neph_001',next_review:30},
  // 15 geri_neph
  {patient_id:'N15',visit_id:'nv_15',age:85,functional_status:'frail',comorbidities:'multiple',gdmt_recommendations:'life_expectancy_relevant',polypharmacy_count:12,decision_shared:1,priorities:'quality_of_life',provider:'neph_001',next_review:90},
  // 16 elderly_ckd
  {patient_id:'N16',visit_id:'nv_16',age:80,egfr:30,proteinuria:0.3,frailty_score:7,cognitive_status:'mci',polypharmacy_count:10,dietary_changes:'adjusted',prognosis:'guarded',provider:'neph_001',next_review:90},
  // 17 gentiurian_dialysis
  {patient_id:'N17',visit_id:'nv_17',age:88,dialysis_modality:'palliative',frequency:2,session_hours:3.5,symptoms:'fatigue',target_dry_weight:'individualized',quality_of_life_score:7,advance_directive:1,life_expectancy_estimate:'6mo',provider:'neph_001',next_review:30},
  // 18 nephro_epidemic
  {patient_id:'N18',visit_id:'nv_18',study_design:'retrospective_cohort',sample_size:500,prevalence:'5pct',incidence:'2pct_year',cfr:'mortality_5pct_5yr',risk_factors:'identified',biomarkers:'studied',population:'worldwide',provider:'neph_001',next_review:90},
  // 19 nephro_global
  {patient_id:'N19',visit_id:'nv_19',region:'low_middle_income',kidney_disease_burden:'high',access_to_dialysis:30,pollution_exposure:'relevant',primary_etiology:'infection_dka',awareness_score:'5pct',research_priority:'diabetes_htn',provider:'neph_001',next_review:90},
  // 20 peritoneal_dialysis
  {patient_id:'N20',assessment_id:'na_20',pd_type:'capd',kt_v:2.1,urine_volume_ml_day:800,dialysate_volume_per_exchange:2000,exchanges_per_day:4,last_peritonitis_episodes:1,exit_site_status:'clean',pet_present:false,creatinine:6.0,gfr:5,anemia_status:'treated_esa',provider:'neph_001',next_review:30},
  // 21 transplant_clinic
  {patient_id:'N21',visit_id:'nv_21',days_post_transplant:365,creatinine:1.4,gfr:55,tacrolimus_level:8.5,egfr:55,biopsy_results:'no_rejection',recent_rejection:false,fluids_urine_output:2000,immunosuppression:'tac_mmf_pred',infection_present:false,provider:'neph_001',next_review:30},
  // 22 dialysis_vascular_access
  {patient_id:'N22',assessment_id:'na_22',access_type:'av_fistula',access_location:'left_arm',access_age_months:24,flow_rate_ml_min:800,steal_syndrome:false,thrombosis_history:false,complication:'none',last_fistulagram_months_ago:6,intervention_needed:'monitoring',provider:'neph_001',next_review:30},
  // 23 anemia_ckd
  {patient_id:'N23',visit_id:'nv_23',hemoglobin:10.5,ferritin:250,tsat:25,esa_started:true,esa_type:'darbepoetin',esa_dose:40,iron_status:'adequate',retic_count:1.5,depression_score:'mild',provider:'neph_001',next_review:30},
  // 24 bone_metabolism_ckd
  {patient_id:'N24',visit_id:'nv_24',calcium:9.2,phosphorus:4.8,pth:380,bap_alk_phos:85,vitamin_d:'sufficient',cinacalcet:true,calcium_carbonate:true,femoral_status:'osteopenia',last_dexa_t_score:-1.8,provider:'neph_001',next_review:90}
];

for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/neph_body_${i}.json`, JSON.stringify(bodies[i]));
}
for (const m of mods) {
  const router = `// filepath: tier87_neph_ext_${m.eng}_${m.name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier87_neph_ext_${m.eng}_${m.name}_engine');
const eps = ['${m.eps.join("','")}'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
`;
  fs.writeFileSync(path.join(__dirname, `tier87_neph_ext_${m.eng}_${m.name}_router.js`), router);
}
console.log(`Wrote ${bodies.length} bodies and ${mods.length} routers`);
