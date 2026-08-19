// filepath: gen_tier84.js
const fs = require('fs');
const path = require('path');

const mods = [
  { name: 'psych_general', eng: 443, base: 0,
    eps: ['psych_eval','intake','med_management','psychotherapy','discharge'] },
  { name: 'psych_anxiety', eng: 444, base: 5,
    eps: ['anxiety_screen','ocd_eval','ptsd','panic','social_anxiety'] },
  { name: 'psych_mood', eng: 445, base: 10,
    eps: ['depression','bipolar','pms_pmdd','postpartum','seasonal'] },
  { name: 'psych_sud', eng: 446, base: 15,
    eps: ['alcohol','opioid','cannabis','stimulant','dual_diagnosis'] },
  { name: 'psych_emerg', eng: 447, base: 20,
    eps: ['suicidal','psych_emerg_eval','restraint','psychosis','crisis'] }
];

const bodies = [
  // 0 psych_eval
  {patient_id:'P0',assessment_id:'pa_00',age:32,referral_source:'primary_care',chief_complaint:'depression',presenting_symptoms:'low_mood',duration_months:6,family_history:'mother_depression',substance_use:'none',risk_assessment:'low',diagnosis:'depression',provider:'ps_001',next_review:14},
  // 1 intake
  {patient_id:'P1',visit_id:'pv_01',age:30,gender:'female',marital_status:'single',children_count:0,occupation:'teacher',education:'college',substance_use_history:false,psychiatric_history:true,medical_history:'asthma',family_psychiatric_history:'father_depression',provider:'ps_001',next_review:30},
  // 2 med_management
  {patient_id:'P2',visit_id:'pv_02',medication:'ssri',medication_name:'sertraline',dosage_mg:100,frequency:'qd',adherence:true,side_effects:'mild',phq9_score:8,response:'improving',provider:'ps_001',next_review:14},
  // 3 psychotherapy
  {patient_id:'P3',visit_id:'pv_03',modality:'cbt',session_count:6,session_duration_min:50,topics_covered:'thought_records',progress_score:7,homework_assigned:true,risk_issues:false,next_session_weeks:1,provider:'ps_001',next_review:7},
  // 4 discharge
  {patient_id:'P4',visit_id:'pv_04',treatment_duration_weeks:24,discharge_reason:'completed',discharge_status:'recovered',relapse_prevention_plan:true,safety_plan_provided:false,follow_up_weeks:12,communication_with_pcp:true,recommendations:'followup_pcp_6mo',provider:'ps_001',next_review:90},
  // 5 anxiety_screen
  {patient_id:'P5',visit_id:'pv_05',gad7_score:14,severity:'moderate',symptoms_count:5,duration_months:6,work_impairment:true,social_impairment:true,sleep_disturbance:true,treatment:'ssri_therapy',follow_up_weeks:4,provider:'ps_001',next_review:30},
  // 6 ocd_eval
  {patient_id:'P6',assessment_id:'pa_06',ybocs_score:32,ybocs_obsessions:16,ybocs_compulsions:16,ego_dystonic:true,time_spent_hours:4,work_impairment:true,erp_therapy:true,ssri_started:true,clomipramine_started:0,deep_brain_stimulation:false,follow_up_weeks:4,provider:'ps_001',next_review:30},
  // 7 ptsd
  {patient_id:'P7',assessment_id:'pa_07',trauma_type:'combat',pcl5_score:60,duration_months:'gt12',intrusion_symptoms:true,avoidance:true,hyperarousal:true,dissociation:true,combat_exposure:true,treatment:'cbt_emdr',follow_up_weeks:4,provider:'ps_001',next_review:30},
  // 8 panic
  {patient_id:'P8',assessment_id:'pa_08',episodes_per_week:3,agoraphobia:true,pd_ss_score:18,episode_duration_min:20,physical_symptoms:'chest_pain',dispatcher_visits:false,between_episodes_anticipatory:7,treatment:'cbt_ssri',exposure_therapy:true,follow_up_weeks:4,provider:'ps_001',next_review:30},
  // 9 social_anxiety
  {patient_id:'P9',assessment_id:'pa_09',liebowitz_score:75,subtype:'generalized',age_onset:14,avoidance:true,functional_impairment:true,school_work_avoidance:true,comorbid_depression:true,treatment:'cbt_ssri',exposure_therapy:true,follow_up_weeks:4,provider:'ps_001',next_review:30},
  // 10 depression
  {patient_id:'P10',visit_id:'pv_10',phq9_score:18,severity:'moderately_severe',si_present:false,symptoms_count:8,fatigue_present:true,sleep_disturbance:true,appetite_change:true,anhedonia:true,treatment:'ssri_therapy',provider:'ps_001',next_review:14},
  // 11 bipolar
  {patient_id:'P11',assessment_id:'pa_11',bipolar_type:'bipolar_i',current_episode:'manic',young_mania_score:25,phq9_score:5,psychotic_features:false,hospitalized:false,mood_stabilizer:'lithium',lithium_level:0.9,follow_up_weeks:2,provider:'ps_001',next_review:14},
  // 12 pms_pmdd
  {patient_id:'P12',visit_id:'pv_12',age:32,cycle_length_days:28,symptoms_days:7,pms_affect_function:true,pmdd_confirmed:true,daily_symptom_score:120,work_impairment:true,treatment:'ssri_intermittent',ssri_trial:true,improvement_pct:60,provider:'ps_001',next_review:30},
  // 13 postpartum
  {patient_id:'P13',assessment_id:'pa_13',postpartum_weeks:6,epds_score:16,severity:'moderate',bonding_issues:true,intrusive_thoughts:false,thoughts_of_harm:false,partner_support:true,treatment:'therapy_ssri',breastfeeding:true,follow_up_weeks:2,provider:'ps_001',next_review:14},
  // 14 seasonal
  {patient_id:'P14',visit_id:'pv_14',sps_score:24,season:'winter',recurrent_pattern:true,episodes_per_year:1,typical_duration_weeks:16,treatment:'light_therapy',light_therapy_started:true,light_box_lux:10000,light_duration_min:30,provider:'ps_001',next_review:14},
  // 15 alcohol
  {patient_id:'P15',assessment_id:'pa_15',drinks_per_day:8,drinks_per_week:50,audit_score:24,last_drink_days:1,withdrawal_present:true,ciwa_ar_score:'mild',bac_level:0.18,treatment:'detox_inpatient',plan:'detox_then_rehab',provider:'ps_001',next_review:3},
  // 16 opioid
  {patient_id:'P16',assessment_id:'pa_16',opioid_type:'oxycodone',duration_years:3,last_use_days:2,cows_score:8,treatment:'buprenorphine',overdose_history:true,naloxone_prescribed:true,fentanyl_test_strip:true,follow_up_weeks:1,provider:'ps_001',next_review:7},
  // 17 cannabis
  {patient_id:'P17',assessment_id:'pa_17',use_per_week:7,years_use:5,last_use_24h:true,use_motivation:'recreational',dependence_present:true,cessation_attempt:true,cannabis_use_disorder_score:8,treatment:'cbt_support_group',comorbid_psych:true,follow_up_weeks:4,provider:'ps_001',next_review:30},
  // 18 stimulant
  {patient_id:'P18',assessment_id:'pa_18',type:'cocaine',years_use:2,last_use_days:3,injection_use:false,use_per_week:4,psychotic_symptoms:false,treatment:'cm_cbt',comorbid_adhd:false,comorbid_bipolar:false,recommendation:'outpatient',provider:'ps_001',next_review:14},
  // 19 dual_diagnosis
  {patient_id:'P19',assessment_id:'pa_19',psychiatric_diagnosis:'bipolar_i',substance_diagnosis:'cocaine_use_disorder',duration_years:5,severity_psychiatric:true,severity_substance:true,integrated_treatment:true,treatment_plan:'integrated',medications_for_sud:true,medications_for_psych:true,follow_up_weeks:2,provider:'ps_001',next_review:14},
  // 20 suicidal
  {patient_id:'P20',assessment_id:'pa_20',c_ssrs_score:5,si_present:true,plan_present:false,means_access:false,intent_present:true,prior_attempts:'none',protective_factors:5,risk_level:'high',disposition:'safety_plan_discharge',safety_plan_components:'plan_means_restriction',provider:'ps_001',next_review:1},
  // 21 psych_emerg_eval
  {patient_id:'P21',assessment_id:'pa_21',presentation:'agitation',violence_risk:false,violence_history:false,psychosis_present:false,orientation:'oriented',danger_to_self:'active',danger_to_others:'passive',disposition:'observation',toxicology_done:true,recommendation:'observation_4h',provider:'ps_001',next_review:1},
  // 22 restraint
  {patient_id:'P22',procedure_id:'pp_22',type:'physical',duration_min:15,consent_obtained:false,physician_ordered:true,indication:'agitation',reassessment_min:30,complications:'none',debriefed:true,release_time:15,provider:'ps_001',next_review:1},
  // 23 psychosis
  {patient_id:'P23',assessment_id:'pa_23',diagnosis:'schizophrenia',duration_weeks:52,symptoms:'auditory_hallucinations',brief_psychotic_resolution:false,first_psychotic_episode:false,hospitalized:true,treatment:'antipsychotic_depot',cgascore:50,family_education:true,provider:'ps_001',next_review:14},
  // 24 crisis
  {patient_id:'P24',assessment_id:'pa_24',crisis_type:'suicidal',crisis_score:8,safety_plan_complete:true,crisis_line_provided:true,follow_up_hours:24,disposition:'urgent_followup',family_contacted:true,means_restriction:true,recommendation:'urgent_psych_referral',provider:'ps_001',next_review:1}
];

for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/ps_body_${i}.json`, JSON.stringify(bodies[i]));
}
for (const m of mods) {
  const router = `// filepath: tier84_psych_ext_${m.eng}_${m.name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier84_psych_ext_${m.eng}_${m.name}_engine');
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
  fs.writeFileSync(path.join(__dirname, `tier84_psych_ext_${m.eng}_${m.name}_router.js`), router);
}
console.log(`Wrote ${bodies.length} bodies and ${mods.length} routers`);
