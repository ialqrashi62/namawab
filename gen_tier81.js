// filepath: gen_tier81.js
const fs = require('fs');
const path = require('path');

const mods = [
  { name: 'uro_general', eng: 428, base: 0,
    eps: ['uro_clinic','hematuria_workup','incontinence','urodynamics','prostate_benign'] },
  { name: 'uro_renal', eng: 429, base: 5,
    eps: ['renal_stone','renal_mass','renal_failure','uti_management','prostate_biopsy'] },
  { name: 'uro_onco', eng: 430, base: 10,
    eps: ['bladder_cancer','prostate_cancer','renal_cancer','testicular_cancer','uro_chemo'] },
  { name: 'uro_peds', eng: 431, base: 15,
    eps: ['pediatric_enuresis','cryptorchidism','hypospadias','circumcision','pediatric_vesicoureteral'] },
  { name: 'uro_andrology', eng: 432, base: 20,
    eps: ['erectile_dysfunction','infertility','peyronie_disease','vasectomy','vasectomy_reversal'] }
];

const bodies = [
  // 0 uro_clinic
  {patient_id:'U0',visit_id:'uv_00',complaint:'hematuria',duration_months:2,exam_findings:'normal',smoking_history:true,occupation:'office',medications:'none',impression:'hematuria_evaluate',treatment_plan:'image_workup',provider:'uro_001',next_review:14},
  // 1 hematuria_workup
  {patient_id:'U1',assessment_id:'ua_01',hematuria_type:'gross',painless:true,clot_passage:false,smoking_history:true,number_evaluation:4,urinalysis:true,ct_urogram:true,cystoscopy:true,findings:'nml_urothelium',diagnosis:'benign_hematuria',provider:'uro_001',next_review:12},
  // 2 incontinence
  {patient_id:'U2',assessment_id:'ua_02',type:'stress',episodes_per_week:5,pad_count:'2_per_day',fluid_intake:'normal',pelvic_floor_therapy:true,medications_started:true,medication_name:'oxybutynin',surgical_consult:false,treatment:'pt_meds',provider:'uro_001',next_review:14},
  // 3 urodynamics
  {patient_id:'U3',study_id:'us_03',capacity:400,compliance:30,max_flow_rate:15,residual_volume:50,detrusor_overactivity:false,stress_incontinence:true,impression:'stress_incontinence',recommendation:'pt_then_sling',duration_min:30,provider:'uro_001',next_review:14},
  // 4 prostate_benign
  {patient_id:'U4',assessment_id:'ua_04',age:65,psa:3.5,prostate_volume:45,ipss_score:18,qmax:12,residual_volume:80,medication:'tamsulosin',surgical_consult:false,recommendation:'continue_meds',provider:'uro_001',next_review:12},
  // 5 renal_stone
  {patient_id:'U5',assessment_id:'ua_05',stone_location:'upper_ureter',stone_size_mm:8,hounsfield_units:600,stone_composition:'calcium_oxalate',hydronephrosis:true,fever_present:false,creatinine:1.2,management:'ureteroscopy',provider:'uro_001',next_review:14},
  // 6 renal_mass
  {patient_id:'U6',assessment_id:'ua_06',side:'right',mass_size_cm:3.5,imaging_modality:'ct',renas_score:'low',enhancement:true,growth_rate_per_year:0.5,management:'active_surveillance',biopsy_done:true,pathology:'clear_cell',provider:'uro_001',next_review:24},
  // 7 renal_failure
  {patient_id:'U7',assessment_id:'ua_07',creatinine:5.5,gfr:12,aki_stage:'failure',urea:90,potassium:5.5,oliguria:true,dialysis_required:true,dialysis_type:'hemodialysis',etiology:'septic_aki',provider:'uro_001',next_review:3},
  // 8 uti_management
  {patient_id:'U8',assessment_id:'ua_08',infection_type:'cystitis',organism:'e_coli',leukocyte_count:80,nitrite:1,fever:false,duration_days:3,hospitalized:false,antibiotic:'ciprofloxacin',sensitivities:'full',provider:'uro_001',next_review:7},
  // 9 prostate_biopsy
  {patient_id:'U9',procedure_id:'up_09',psa:6.5,prostate_volume:40,psad:0.16,mri_done:true,pirads:'pi4',cores_taken:12,cores_positive:3,gleason:'3_plus_4',complications:'none',provider:'uro_001',next_review:14},
  // 10 bladder_cancer
  {patient_id:'U10',assessment_id:'ua_10',tumor_type:'urothelial',stage:'t1',grade:'high',treatment:'intravesical_bcg',tumor_size_cm:2,focal_count:3,cis_present:false,re_cystoscopy:true,surgery_planned:false,provider:'uro_001',next_review:12},
  // 11 prostate_cancer
  {patient_id:'U11',assessment_id:'ua_11',psa:8,prostate_volume:35,gleason_score:'3_plus_4',stage:'t2',risk_group:'favorable_intermediate',treatment:'radical_prostatectomy',active_surveillance:false,surgical_candidate:true,referred_radiation_onc:false,provider:'uro_001',next_review:14},
  // 12 renal_cancer
  {patient_id:'U12',assessment_id:'ua_12',histology:'clear_cell',stage:'t1b',treatment:'partial',tumor_size_cm:4.5,metastases_present:false,performance_status:'kps_90_plus',surgical_candidate:true,follow_up_weeks:12,provider:'uro_001',next_review:12},
  // 13 testicular_cancer
  {patient_id:'U13',assessment_id:'ua_13',side:'left',histology:'seminoma',pre_op_ldh:300,pre_op_afp:5,pre_op_bhcg:500,stage:'t1n0m0',treatment:'surveillance',fertility_preserved:true,prosthesis:'silicone',follow_up_weeks:8,provider:'uro_001',next_review:8},
  // 14 uro_chemo
  {patient_id:'U14',assessment_id:'ua_14',cancer_type:'bladder',regimen:'gemcitabine_cisplatin',cycle_number:3,dose_reduction:0,toxicity:false,toxicity_grade:'g1',neutrophil_count:3500,creatinine:1.2,treatment_response:'partial',provider:'uro_001',next_review:8},
  // 15 pediatric_enuresis
  {patient_id:'U15',visit_id:'uv_15',age_years:7,type:'nighttime',episodes_per_week:4,fluid_intake_ml:1200,bowel_history:false,management:'bed_wet_alarm',psychological_referral:false,follow_up_weeks:8,treatment_response:'improving',provider:'uro_001',next_review:56},
  // 16 cryptorchidism
  {patient_id:'U16',assessment_id:'ua_16',age_months:18,side:'right',location:'inguinal',management:'orchiopexy',operative_age_months:24,surgical_planned:true,follow_up_weeks:4,fertility_counseling:'complete',provider:'uro_001',next_review:30},
  // 17 hypospadias
  {patient_id:'U17',assessment_id:'ua_17',age_months:18,location:'distal',chordee_severity:0,surgical_technique:'tip',stages_planned:1,follow_up_weeks:12,complications:'none',cosmetic_result:'good',additional_surgeries_needed:false,provider:'uro_001',next_review:90},
  // 18 circumcision
  {patient_id:'U18',procedure_id:'up_18',age_months:3,technique:'plastibell',anesthesia:'local',operative_time_min:10,complications:false,complication_type:'none',post_op_care:'routine',satisfaction:'good',provider:'uro_001',next_review:14},
  // 19 pediatric_vesicoureteral
  {patient_id:'U19',assessment_id:'ua_19',age_years:4,grade:'iii',recurrent_uti:true,episode_count_6mo:3,prophylaxis_started:true,prophylaxis_agent:'bactrim',surgical_referral:true,deflux_injection_planned:'planned',last_imaging_finding:3,provider:'uro_001',next_review:30},
  // 20 erectile_dysfunction
  {patient_id:'U20',assessment_id:'ua_20',age:55,iief_score:12,diabetes:true,cardiovascular_disease:false,hypertension:true,testosterone_total:400,psa_if_indicated:1.5,treatment:'pde5',counseling_referral:true,provider:'uro_001',next_review:14},
  // 21 infertility
  {patient_id:'U21',assessment_id:'ua_21',fsh:5,lh:4,testosterone_total:450,sperm_count_million_ml:8,motility:'reduced',morphology:'reduced',varicocele:true,referred_repro:true,partner_evaluation:'normal',provider:'uro_001',next_review:30},
  // 22 peyronie_disease
  {patient_id:'U22',assessment_id:'ua_22',phase:'chronic',curvature_degrees:45,ede_degree:15,painful:false,plaque_size_cm:1.5,peyronie_affects_intercourse:true,treatment:'collagenase',surgical_referral:false,provider:'uro_001',next_review:14},
  // 23 vasectomy
  {patient_id:'U23',procedure_id:'up_23',technique:'no_scalpel',anesthesia:'local',operative_time_min:20,episodes_complications:0,complications:'none',sem_analysis_planned:true,sem_analysis_weeks:12,counseling_complete:true,provider:'uro_001',next_review:90},
  // 24 vasectomy_reversal
  {patient_id:'U24',surgery_id:'us_24',time_since_vasectomy_years:5,technique:'vv',operative_time_min:120,patency_rate_expected:80,sperm_present_3mo:true,complications:'none',follow_up_weeks:12,pregnancy_achieved:false,recommendation:'continue_assess',provider:'uro_001',next_review:60}
];

for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/uro_body_${i}.json`, JSON.stringify(bodies[i]));
}
for (const m of mods) {
  const router = `// filepath: tier81_uro_ext_${m.eng}_${m.name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier81_uro_ext_${m.eng}_${m.name}_engine');
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
  fs.writeFileSync(path.join(__dirname, `tier81_uro_ext_${m.eng}_${m.name}_router.js`), router);
}
console.log(`Wrote ${bodies.length} bodies and ${mods.length} routers`);
