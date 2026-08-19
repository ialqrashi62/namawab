// filepath: gen_tier86.js
const fs = require('fs');
const path = require('path');

const mods = [
  { name: 'card_heart_failure', eng: 453, base: 0,
    eps: ['hf_initial','hf_followup','cardiomyopathy','aldosterone_antag','heart_transplant'] },
  { name: 'card_intervention', eng: 454, base: 5,
    eps: ['cath_followup','pci_followup','cabg_followup','structural_followup','tavr_followup'] },
  { name: 'card_imaging', eng: 455, base: 10,
    eps: ['echo_followup','stress_test','nuclear_imaging','cardiac_mri','cardiac_ct_angio'] },
  { name: 'card_rehab', eng: 456, base: 15,
    eps: ['cr_initial','cr_phase2','cr_discharge','cr_followup','cr_outcomes'] },
  { name: 'card_arrhythmia', eng: 457, base: 20,
    eps: ['afib_initial','afib_followup','anticoag_clinic','vt_eval','device_check'] }
];

const bodies = [
  // 0 hf_initial
  {patient_id:'C0',assessment_id:'ca_00',nyha_class:2,ef_pct:30,bnp:850,chf_type:'hfrEF',etiology:'ischemic',diuretic:'furosemide',ace_inhibitor:'lisinopril',beta_blocker:'carvedilol',aldosterone_antag_started:true,follow_up_weeks:2,provider:'card_001',next_review:14},
  // 1 hf_followup
  {patient_id:'C1',visit_id:'cv_01',ef_pct:35,bnp:450,weight_kg:80,bp_systolic:130,bp_diastolic:80,fluid_status:'euvolemic',exercise_tolerance:5,follow_up_weeks:2,functional_status:'stable',provider:'card_001',next_review:14},
  // 2 cardiomyopathy
  {patient_id:'C2',assessment_id:'ca_02',cardiomyopathy_type:'dilated',ef_pct:25,genetic_testing:'pending',family_history:true,biopsy_considered:false,device_consulted:true,medical_therapy:'four_pillar',referral_list:'transplant',advanced_therapy_referral:true,provider:'card_001',next_review:30},
  // 3 aldosterone_antag
  {patient_id:'C3',visit_id:'cv_03',medication:'spironolactone',start_dose_mg:25,current_dose_mg:50,monitoring_potassium:4.5,monitoring_creatinine:1.2,side_effects:'mild_gynecomastia',contraindications:'none',response:'improving',follow_up_weeks:8,provider:'card_001',next_review:60},
  // 4 heart_transplant
  {patient_id:'C4',assessment_id:'ca_04',unos_status:'1b',years_post_transplant:2,immunosuppression:'tacrolimus_mmf',biopsy_results:'grade_0',rejection_episodes:1,cardiac_allograft_vasculopathy:'none',post_transplant_lymphoma_screened:true,follow_up_weeks:4,provider:'card_001',next_review:30},
  // 5 cath_followup
  {patient_id:'C5',visit_id:'cv_05',cath_date:'2026-07-15',access_site:'radial',procedure_type:'diagnostic',contrast_volume_ml:60,fluoroscopy_min:10,complications:'none',post_procedure_creatinine:1.2,discharge_dose:'second_day',follow_up_weeks:4,provider:'card_001',next_review:30},
  // 6 pci_followup
  {patient_id:'C6',visit_id:'cv_06',procedure_type:'des_2v',vessels_treated:2,stent_count:3,dapt_continued:true,duration_weeks:12,complications:'none',ejection_fraction_post:40,functional_status:'asymptomatic',rehab_referral:true,provider:'card_001',next_review:30},
  // 7 cabg_followup
  {patient_id:'C7',visit_id:'cv_07',cabiag_date:'2026-05-01',graft_count:3,wound_healing:'complete',sternum_status:'wired_intact',mediastinitis_present:false,ejection_fraction:50,aspirin:'continued',statin_started:true,follow_up_weeks:8,provider:'card_001',next_review:30},
  // 8 structural_followup
  {patient_id:'C8',visit_id:'cv_08',procedure_type:'tavr',valve_size_mm:26,access:'transfemoral',complications:'pvl_mild',paravalvular_leak:1,grad_mean_mm_hg:12,ejection_fraction_post:55,functional_status:'improved',anticoag_duration_weeks:12,provider:'card_001',next_review:90},
  // 9 tavr_followup
  {patient_id:'C9',visit_id:'cv_09',procedure_completed:true,valve_type:'sapien',approach:'transfemoral',residual_aortic_regurgitation:'mild',conduction_defect:false,pacemaker_placed:false,anticoag_continued:false,follow_up_echo:1,functional_capacity:'improving',provider:'card_001',next_review:90},
  // 10 echo_followup
  {patient_id:'C10',visit_id:'cv_10',ef_pct:55,wall_motion_abnormalities:'inferior_hypokinesia',valve_status:'normal',pah_severity:'mild',lv_function:'normal_lvef',diastolic_function:'grade1',follow_up_weeks:24,recommendation:'annual',provider:'card_001',next_review:52},
  // 11 stress_test
  {patient_id:'C11',visit_id:'cv_11',stress_type:'exercise',peak_mets:10,peak_hr:170,max_predicted_hr:180,bp_response:'adequate',ecg_changes:'st_depression_1mm',chest_pain_reproduced:false,result:'ischemic_mild',recommendation:'risk_strat',provider:'card_001',next_review:30},
  // 12 nuclear_imaging
  {patient_id:'C12',visit_id:'cv_12',study_type:'spect',summed_stress_score:8,summed_rest_score:2,ischemia_pct:12,scar_pct:5,ef_stress:50,lv_volume_stress:80,recommendation:'cath_referral',follow_up_weeks:4,provider:'card_001',next_review:30},
  // 13 cardiac_mri
  {patient_id:'C13',visit_id:'cv_13',study_type:'viability',ef_pct:30,lvedd_mm:65,scar_pct:25,edema_present:false,viability_pct:50,iron_overload:'mild',pericardial_effusion:'trivial',recommendation:'revascularization_eval',follow_up_weeks:8,provider:'card_001',next_review:30},
  // 14 cardiac_ct_angio
  {patient_id:'C14',visit_id:'cv_14',study_type:'coronary_cta',cad_rads:3,stenoses_severity:'moderate',plaque_burden:'moderate',high_risk_plaque:false,calcium_score:180,symptomatic_class:'atypical',recommendation:'functional_stress',follow_up_weeks:4,provider:'card_001',next_review:30},
  // 15 cr_initial
  {patient_id:'C15',assessment_id:'ca_15',referral_diagnosis:'post_mi',enrollment_weeks:2,initial_6mwt_m:300,exercise_capacity:'reduced',risk_stratification:'moderate',initial_session_count:0,cr_program:'standard_36',baseline_qol_score:65,provider:'cr_001',next_review:14},
  // 16 cr_phase2
  {patient_id:'C16',visit_id:'cv_16',phase:'phase_2',session_count:12,week_in_program:8,exercise_minute_capacity:30,borg_score:11,bp_response:'adequate',hr_max_reached:140,attendance_pct:90,progress_score:7,provider:'cr_001',next_review:14},
  // 17 cr_discharge
  {patient_id:'C17',visit_id:'cv_17',discharge_weeks:36,final_6mwt_m:500,exercise_capacity:'improved',sessions_attended:36,program_completion:true,qol_score_change:25,long_term_exercise_plan:true,self_managed_exercise:true,follow_up_weeks:12,provider:'cr_001',next_review:90},
  // 18 cr_followup
  {patient_id:'C18',visit_id:'cv_18',months_post_dc:6,exercise_adherence:true,sessions_per_week:3,intensity:'moderate',weight_kg:75,bp_systolic:128,lipid_ldl:80,rehab_support_referral_needed:false,follow_up_weeks:24,provider:'cr_001',next_review:180},
  // 19 cr_outcomes
  {patient_id:'C19',visit_id:'cv_19',study_period_months:12,participants_count:50,completion_pct:80,improvement_score:40,rehospitalization_pct:10,mortality_pct:2,patient_satisfaction:9,provider:'cr_001',next_review:90},
  // 20 afib_initial
  {patient_id:'C20',assessment_id:'ca_20',afib_type:'paroxysmal',cha2ds2_vasc:3,has_bled:1,anticoag_started:true,anticoagulant:'apixaban',hr_at_diagnosis:140,lv_ef:55,la_size:42,referral_ep:true,rhythm_strategy:'rhythm_control',provider:'card_001',next_review:14},
  // 21 afib_followup
  {patient_id:'C21',visit_id:'cv_21',rate_control_med:'beta_blocker',target_hr_rest:80,in_therapeutic_range:true,inr:2,adherence:true,thromboembolism_events:'none',stable:true,referral_ep:false,follow_up_weeks:4,provider:'card_001',next_review:30},
  // 22 anticoag_clinic
  {patient_id:'C22',visit_id:'cv_22',on_warfarin:false,doac:true,creatinine_clearance:80,dose_reduced:false,bleeding_events:false,complications:'none',indication:'afib',follow_up_weeks:12,provider:'card_001',next_review:90},
  // 23 vt_eval
  {patient_id:'C23',assessment_id:'ca_23',vt_type:'sustained',stable:true,storm:false,lv_ef:30,qt_interval:450,structural_heart:true,icd_in_situ:true,icd_proposed:false,treatment:'icd_antiarrhythmic',provider:'card_001',next_review:14},
  // 24 device_check
  {patient_id:'C24',visit_id:'cv_24',device_type:'dual_chamber_icd',battery_adequate:true,battery_years_remaining:6,lead_impedance:500,pacing_threshold:0.8,episode_count:2,shock_therapy_delivered:false,alert_reviewed:true,action:'program_change',provider:'card_001',next_review:90}
];

for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/card_body_${i}.json`, JSON.stringify(bodies[i]));
}
for (const m of mods) {
  const router = `// filepath: tier86_card_ext_${m.eng}_${m.name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier86_card_ext_${m.eng}_${m.name}_engine');
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
  fs.writeFileSync(path.join(__dirname, `tier86_card_ext_${m.eng}_${m.name}_router.js`), router);
}
console.log(`Wrote ${bodies.length} bodies and ${mods.length} routers`);
