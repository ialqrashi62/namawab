// filepath: gen_tier55.js
const fs = require('fs');

const routes = [
  [308, 'triage_acu', 'esi_level_1,esi_level_2,esi_level_3,esi_level_4,esi_level_5'],
  [309, 'triage_intake', 'chief_complaint_evaluation,vital_signs_triage,presenting_symptoms,allergy_history,medication_reconciliation'],
  [310, 'triage_screen', 'suicide_risk_screen,substance_use_screen,domestic_violence_screen,trauma_screen,psychiatric_screen'],
  [311, 'triage_ped', 'ped_assessment_triangle,ped_color_breath_circulation,ped_illness_severity,ped_pain_assessment,ped_growth_review'],
  [312, 'triage_disp', 'discharge_instructions,referral_placement,follow_up_appointment,return_precaution,community_resources'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier55_triage_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier55_triage_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier55_triage_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['t_esi1','/api/triage_acu/esi_level_1',{patient_id:'T1',presentation:'cardiac_arrest_unresponsive',intervention:'cpr_intubation_immediately',triage_decision:'resus_bay','time_to_provider_min':0}],
  ['t_esi2','/api/triage_acu/esi_level_2',{patient_id:'T2','presentation':'severe_respiratory_distress_stable_bp',intervention:'high_flow_o2_immediate_physician','triage_decision':'acute_treatment_room','time_to_provider_min':5}],
  ['t_esi3','/api/triage_acu/esi_level_3',{patient_id:'T3','presentation':'abdominal_pain_vitals_normal','intervention':'labs_imaging_consult',triage_decision:'standard_room','time_to_provider_min':30}],
  ['t_esi4','/api/triage_acu/esi_level_4',{patient_id:'T4',presentation:'simple_laceration',intervention:'wound_care_in_room',triage_decision:'fast_track',time_to_provider_min:60}],
  ['t_esi5','/api/triage_acu/esi_level_5',{patient_id:'T5',presentation:'medication_refill_no_acute_concern',intervention:'discharge_with_prescription',triage_decision:'fast_track_to_discharge',time_to_provider_min:120}],

  ['t_chf','/api/triage_intake/chief_complaint_evaluation',{patient_id:'I1','chief_complaint':'chest_pain','duration':'1_hour','associated_symptoms':'sweating_nausea','severity_self_reported':8,'onset':'sudden','relevance':'emergent'}],
  ['t_vst','/api/triage_intake/vital_signs_triage',{patient_id:'I2','temp':37.2,'heart_rate':88,'resp_rate':18,'bp_systolic':142,'bp_diastolic':88,'oxygen_sat':97,'pain_score':4,'interpretation':'stable_no_red_flags'}],
  ['t_psm','/api/triage_intake/presenting_symptoms',{patient_id:'I3','symptoms_list':'fever_cough_shortness_breath','duration_days':3,'severity':'moderate','red_flags_present':false,'triage_impression':'possible_respiratory_infection'}],
  ['t_alg','/api/triage_intake/allergy_history',{patient_id:'I4','allergens':['penicillin','shellfish'],severity:'severe','reaction':'anaphylaxis_to_penicillin','documented_in_record':true,'alert_bracelet':false}],
  ['t_med','/api/triage_intake/medication_reconciliation',{patient_id:'I5','med_count':6,'high_risk_meds':'warfarin_insulin','compliance':'good','interactions_reviewed':0,'pharmacist_consult_planned':false}],

  ['t_sui','/api/triage_screen/suicide_risk_screen',{patient_id:'S1','phq2_score':4,'phq9_score':18,'sad_persons_score':5,'si_present':false,'plan_present':false,'means_restricted':true,'referral':'psych_consult'}],
  ['t_sub','/api/triage_screen/substance_use_screen',{patient_id:'S2','cage_score':3,'audit_c':12,'dast_score':5,'substance':'alcohol_cannabis','brief_intervention_offered':true,'referral':'addiction_clinic'}],
  ['t_dv','/api/triage_screen/domestic_violence_screen',{patient_id:'S3','husband_abuse_history':true,'physical_violence':false,'sexual_violence':false,'safely_at_home':false,'safety_plan':'developed','shelter_referral':'provided'}],
  ['t_trm','/api/triage_screen/trauma_screen',{patient_id:'S4','ace_score':7,'ptsd_screen_positive':true,'ptssd_brief_score':8,'referral':'trauma_therapy_specialist','follow_up_planned':true}],
  ['t_psy','/api/triage_screen/psychiatric_screen',{patient_id:'S5','mini_score':18,'psychiatric_history':'bipolar_diagnosis','medication_adherence':'partial','current_state':'manic_mild','referral':'psych_emergency_consult'}],

  ['t_ped','/api/triage_ped/ped_assessment_triangle',{patient_id:'P1','age_months':18,'appearance':'alert_active','work_of_breathing':'normal','circulation_to_skin':'normal','impression':'well_child'}],
  ['t_cbc','/api/triage_ped/ped_color_breath_circulation',{patient_id:'P2',age_years:3,color:'pink',breathing:'unlabored',circulation:'warm_pink',sat:97,impression:'well'}],
  ['t_pis','/api/triage_ped/ped_illness_severity',{patient_id:'P3','age_years':2,'pews_score':3,'work_of_breathing':'mild','severity':'low_to_moderate','disposition':'urgent_evaluation'}],
  ['t_ppa','/api/triage_ped/ped_pain_assessment',{patient_id:'P4','age_years':7,'flacc_scale':3,'self_report_nrs':4,'pain_management':'oral_analgesic','reassess_min':30}],
  ['t_pgr','/api/triage_ped/ped_growth_review',{patient_id:'P5','age_months':18,'weight_kg':10.5,'height_cm':82,'head_circumference_cm':46,'growth_percentile':'normal','nutrition':'appropriate'}],

  ['t_dci','/api/triage_disp/discharge_instructions',{patient_id:'D1','diagnosis':'viral_uri','instructions':'rest_fluids_acetaminophen','follow_up':'pcp_3_to_5_days','return_precautions':'worsening_dyspnea_high_fever','language':'english_arabic'}],
  ['t_ref','/api/triage_disp/referral_placement',{patient_id:'D2','referral_type':'cardiology_outpatient','reason':'palpitations_workup','appointment_within_weeks':2,'accepting_provider':'located_riyadh','patient_acknowledged':true}],
  ['t_fup','/api/triage_disp/follow_up_appointment',{patient_id:'D3','specialty':'orthopedics','timeframe':'5_7_days','scheduling_done':'before_discharge','barriers_to_followup':'none','contact_phone':'documented'}],
  ['t_rtc','/api/triage_disp/return_precaution',{patient_id:'D4','reviewed':true,'verbalized':true,'specific_warnings':'chest_pain_shortness_breath_bleeding','language_understood':true,'literacy_level':'adequate'}],
  ['t_cmr','/api/triage_disp/community_resources',{patient_id:'D5','social_work_consult':false,'home_health_referral':true,'transportation_assistance':false,'medication_assistance_program':true,'fall_prevention_program':true}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\tri_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_tri_tier55.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);