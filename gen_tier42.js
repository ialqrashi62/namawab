// filepath: gen_tier42.js
const fs = require('fs');

const routes = [
  [243, 'mood_anx', 'depression_mdd,generalized_anxiety,panic_disorder,bipolar_disorder,social_anxiety'],
  [244, 'psychotic', 'schizophrenia,schizoaffective,delusional_disorder,brief_psychotic,substance_induced_psychosis'],
  [245, 'trauma', 'ptsd,acute_stress,adjustment_disorder,complex_trauma,dissociative_disorder'],
  [246, 'substance', 'alcohol_use,opioid_use,cannabis_use,stimulant_use,sedative_use'],
  [247, 'neurodev', 'adhd,autism_spectrum,tourette,intellectual_disability,learning_disorder'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier42_psychiatry_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier42_psychiatry_ext_${n}_${name}_engine');
const eps = [${epsArr}];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
`;
  fs.writeFileSync('tier42_psychiatry_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['p_mdd','/api/psych_mood/depression_mdd',{patient_id:'PT1',phq9_score:18,duration_weeks:12,sleep_change:true,appetite_change:true,anhedonia:true,suicidal_ideation:false,prior_episodes:1,treatment:'ssri_started'}],
  ['p_gad','/api/psych_mood/generalized_anxiety',{patient_id:'PT2',gad7_score:15,duration_months:6,restlessness:true,fatigue:true,concentration_issues:true,treatment:'ssri_referral_therapy'}],
  ['p_pan','/api/psych_mood/panic_disorder',{patient_id:'PT3',panic_attacks_month:4,symptoms:'palpitations_sweating_chest_pain',agoraphobia:false,medication:'ssri_benzodiazepine_prn'}],
  ['p_bp','/api/psych_mood/bipolar_disorder',{patient_id:'PT4',current_episode:'manic',ymrs_score:24,phq9_score:8,prior_episodes:3,medication:'lithium_valproate',monitoring:'mood_chart_weekly'}],
  ['p_sa','/api/psych_mood/social_anxiety',{patient_id:'PT5',lsas_score:65,avoidance:4,fear:4,onset_age:14,treatment:'ssri_cognitive_behavioral_therapy'}],

  ['p_sz','/api/psych_psychotic/schizophrenia',{patient_id:'PS1',positive_symptoms:'hallucinations_delusions',negative_symptoms:'avolition_poor_self_care',duration_months:24,medication:'risperidone_4mg',adherence:'good',functioning:'moderate'}],
  ['p_sa','/api/psych_psychotic/schizoaffective',{patient_id:'PS2',mood_episode:'depressive',psychotic_features:'auditory_hallucinations',medication:'olanzapine_fluoxetine',monitoring:'weekly'}],
  ['p_dd','/api/psych_psychotic/delusional_disorder',{patient_id:'PS3',delusion_type:'persecutory',duration_months:18,insight:'limited',functioning:'preserved',medication:'risperidone_low_dose'}],
  ['p_bp','/api/psych_psychotic/brief_psychotic',{patient_id:'PS4',duration_days:14,stressor:'bereavement',symptoms:'paranoid_ideation',outcome:'full_recovery',follow_up:'3_months'}],
  ['p_sp','/api/psych_psychotic/substance_induced_psychosis',{patient_id:'PS5',substance:'methamphetamine',urine_tox:'positive',cessation:'detox_program',antipsychotic:'olanzapine_5mg',reassessment:'2_weeks'}],

  ['p_ptsd','/api/psych_trauma/ptsd',{patient_id:'PT6',pcl5_score:62,trauma_type:'combat',duration_months:8,nightmares:true,avoidance:true,hyperarousal:true,treatment:'emdr_ssri'}],
  ['p_asa','/api/psych_trauma/acute_stress',{patient_id:'PT7',event:'motor_vehicle_accident',days_since:18,symptoms:'intrusive_recollections',dissociation:false,disruption:'moderate',follow_up:'weekly_4_weeks'}],
  ['p_adj','/api/psych_trauma/adjustment_disorder',{patient_id:'PT8',stressor:'divorce',onset_days:30,symptoms:'sadness_worry',severity:'mild',intervention:'supportive_counseling'}],
  ['p_ct','/api/psych_trauma/complex_trauma',{patient_id:'PT9',trauma_history:'childhood_abuse',duration_years:25,symptoms:'emotion_regulation_impairment',dissociation:true,treatment:'phase_oriented_trauma_therapy'}],
  ['p_dd','/api/psych_trauma/dissociative_disorder',{patient_id:'PT10',type:'did',amnesia_episodes:true,identity_alterations:true,functioning:'moderate_impairment',treatment:'phase_oriented_trauma_therapy'}],

  ['p_alc','/api/psych_substance/alcohol_use',{patient_id:'SUB1',audit_score:24,pattern:'daily_binge',dt_risk:'high',ciwa_score:4,intervention:'detox_rehab_referral'}],
  ['p_opi','/api/psych_substance/opioid_use',{patient_id:'SUB2',duration_years:8,iv_use:false,last_use:'3_days_ago',methadone_maintenance:true,overdose_history:1,naloxone_prescribed:true}],
  ['p_can','/api/psych_substance/cannabis_use',{patient_id:'SUB3',frequency:'daily',duration_years:6,impact:'functional',cessation_plan:'gradual_reduction',referral:'addiction_counseling'}],
  ['p_sti','/api/psych_substance/stimulant_use',{patient_id:'SUB4',substance:'cocaine',frequency:'weekly',complications:'none_yet',intervention:'matrix_model_therapy',monitoring:'urine_drug_screen'}],
  ['p_sed','/api/psych_substance/sedative_use',{patient_id:'SUB5',drug:'alprazolam',dose_mg:2,duration_years:4,taper_plan:'gradual_5_percent_week',monitoring:'weekly_assessment'}],

  ['p_adhd','/api/psych_neurodev/adhd',{patient_id:'ND1',asrs_score:18,presentation:'inattentive',onset_age:7,comorbid_anxiety:true,medication:'methylphenidate_36mg',response:'improving'}],
  ['p_asd','/api/psych_neurodev/autism_spectrum',{patient_id:'ND2',ados_score:14,language_level:'verbal',sensory_issues:true,intellectual_functioning:'average',support_level:'level_1'}],
  ['p_tou','/api/psych_neurodev/tourette',{patient_id:'ND3',motor_tics:'present',vocal_tics:'present',duration_years:5,severity:'moderate',medication:'risperidone_low_dose',behavior_therapy:'cbpt'}],
  ['p_id','/api/psych_neurodev/intellectual_disability',{patient_id:'ND4',iq_score:55,adaptive_functioning:'limited',support_needed:'substantial',genetic_workup:'fragile_x_negative',behavior_plan:'positive_behavior_support'}],
  ['p_ld','/api/psych_neurodev/learning_disorder',{patient_id:'ND5',type:'dyslexia',reading_score:'below_grade_2',accommodations:'extended_time_audio',intervention:'structured_literacy'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\psy_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_psy_tier42.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);