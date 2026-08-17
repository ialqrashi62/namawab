// filepath: gen_tier25.js
const fs = require('fs');

const routes = [
  [158, 'function', 'fim_score,barthel,mobility_index,grip_strength,rom'],
  [159, 'therapy', 'pt_plan,ot_plan,slp_plan,discharge_plan,progress'],
  [160, 'prosthetic', 'prosthetic_assess,prosthetic_socket,orthotic_assess,wheelchair_assess,gait_train'],
  [161, 'neuro', 'nih_stroke,coma_recovery,sci_assess,dysphagia,balance_train'],
  [162, 'pediatric', 'developmental,gmfc,feeding_pediatric,early_intervention,school_rehab'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier25_rehab_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier25_rehab_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier25_rehab_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['r_fim','/api/rehab_function/fim_score',{assessment_id:'A1',eating:6,grooming:6,bathing:5,dressing_upper:5,dressing_lower:4,toileting:5,bladder_control:6,bowel_control:6,chair_bed_transfer:4,toilet_transfer:4,tub_shower_transfer:4,walk_wheelchair:5,stairs:3,comprehension:6,expression:5,social_interaction:6,problem_solving:5,memory:6}],
  ['r_brt','/api/rehab_function/barthel',{assessment_id:'A2',feeding:10,bathing:5,grooming:5,dressing:5,bowels:10,bladder:10,toilet_use:10,chair_bed_transfer:15,mobility:15,stairs:5}],
  ['r_mob','/api/rehab_function/mobility_index',{assessment_id:'A3',mobility_level:'community_ambulator',distance_m:200,aid:'single_cane',falls_history:false,timed_up_and_go_sec:11}],
  ['r_gri','/api/rehab_function/grip_strength',{patient_id:'P1',left_kg:30,right_kg:32,dominant_hand:'right',age:55,gender:'male'}],
  ['r_rom','/api/rehab_function/rom',{assessment_id:'A4',joint:'shoulder',flexion_degrees:120,extension_degrees:30,abduction_degrees:100,pain_present:false,end_feel:'firm'}],

  ['r_pt','/api/rehab_therapy/pt_plan',{patient_id:'P1',sessions_per_week:3,duration_weeks:6,discipline:'orthopedic',goal:'return_to_work',home_exercise_program:true}],
  ['r_ot','/api/rehab_therapy/ot_plan',{patient_id:'P1',focus:'adl',sessions_per_week:2,assistive_device_prescribed:true,setting:'outpatient',family_training:true}],
  ['r_slp','/api/rehab_therapy/slp_plan',{patient_id:'P1',diagnosis:'aphasia',swallow_study_done:false,sessions_per_week:3,tracheostomy:false,severity:'moderate'}],
  ['r_dc','/api/rehab_therapy/discharge_plan',{patient_id:'P1',disposition:'home_with_family',los_days:14,family_educated:true,durable_equipment_arranged:true,home_assessment_done:true,fim_score:90}],
  ['r_prg','/api/rehab_therapy/progress',{assessment_id:'A5',days_since_start:21,fim_baseline:80,fim_current:95,goal_met:false,barrier:'fatigue'}],

  ['r_pra','/api/rehab_prosthetic/prosthetic_assess',{patient_id:'P1',amputation_level:'below_knee_transtibial',days_post_amputation:120,residual_limb_shape:'cylindrical',skin_intact:true,range_of_motion_deg:120}],
  ['r_soc','/api/rehab_prosthetic/prosthetic_socket',{socket_id:'S1',socket_type:'pts',proper_fit:true,skin_irritation:false,pressure_pistoning_mm:2,suspension_adequate:true}],
  ['r_ort','/api/rehab_prosthetic/orthotic_assess',{patient_id:'P1',orthosis_type:'afo',proper_fit:true,skin_breakdown:false,function_improved:true,wear_hours_per_day:8}],
  ['r_whl','/api/rehab_prosthetic/wheelchair_assess',{patient_id:'P1',wheelchair_type:'manual_k2',proper_seating:true,skin_check_documented:true,propulsion_adequate:true,years_since_received:2}],
  ['r_gt','/api/rehab_prosthetic/gait_train',{session_id:'G1',gait_phase:'community_walking',distance_m:300,use_prosthesis:true,falls_during_session:false,completed_goals:true}],

  ['r_nih','/api/rehab_neuro/nih_stroke',{assessment_id:'NS1',loc_questions:0,loc_commands:0,best_gaze:0,visual_fields:0,facial_palsy:1,motor_arm_left:1,motor_arm_right:0,motor_leg_left:1,motor_leg_right:0,limb_ataxia:0,sensory:1,best_language:0,neglect:0}],
  ['r_crs','/api/rehab_neuro/coma_recovery',{assessment_id:'NS2',crs_r_level:'motor',days_since_injury:45,follows_command:false,diagnosis:'tbi_traumatic'}],
  ['r_sci','/api/rehab_neuro/sci_assess',{patient_id:'P1',injury_level:'c6',ais_grade:'c_motor_incomplete_low',days_since_injury:45,pressure_injury_present:false}],
  ['r_dys','/api/rehab_neuro/dysphagia',{assessment_id:'NS3',dysphagia_severity:'moderate',aspiration_risk:'moderate',diet_texture:'puree',cough_reflex:true,swallow_study_done:true}],
  ['r_bal','/api/rehab_neuro/balance_train',{session_id:'B1',balance_phase:'dynamic_standing',berg_score:45,falls_30d:1,use_aid:true,duration_min:30}],

  ['r_dev','/api/rehab_pediatric/developmental',{patient_id:'CH1',age_months:24,motor_months:24,language_months:18,social_months:24,cognitive_months:24,regression:false}],
  ['r_gmf','/api/rehab_pediatric/gmfc',{patient_id:'CH1',cp_subtype:'spastic_diplegia',gmfcs_level:'ii',age_years:5,use_assistive_device:false}],
  ['r_feed','/api/rehab_pediatric/feeding_pediatric',{patient_id:'CH1',feeding_method:'oral',weight_kg:18,caloric_intake_kcal_day:1200,aspiration_history:false,feeding_skills:'needs_setup'}],
  ['r_ei','/api/rehab_pediatric/early_intervention',{patient_id:'CH1',age_months:18,service_plan_exists:true,discipline:'pt',visits_per_month:4,family_engaged:true}],
  ['r_sch','/api/rehab_pediatric/school_rehab',{patient_id:'CH1',education_setting:'mainstream_with_support',iep_in_place:true,visits_per_week:2,adaptations_in_place:true,transport:'family'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\rehab_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_rehab_tier25.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);