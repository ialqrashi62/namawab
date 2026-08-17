// filepath: gen_tier32.js
const fs = require('fs');

const routes = [
  [193, 'copd', 'copd_staging,exacerbation,oxygen_therapy,pulmonary_rehab,smoking_cessation'],
  [194, 'asthma', 'asthma_control,biologic_therapy,severe_asthma,asthma_action_plan,occupational_asthma'],
  [195, 'sleep', 'sleep_study,osa_severity,cpap_titration,sleep_hygiene,sleep_medication'],
  [196, 'ild', 'ild_classification,ild_progression,antifibrotic_therapy,oxygen_ild,lung_transplant_eval'],
  [197, 'pulm_critical', 'ventilator_management,weaning_protocol,ards_protocol,tracheostomy,icu_bronchoscopy'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier32_pulmonology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier32_pulmonology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier32_pulmonology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['p_cs','/api/pulm_copd/copd_staging',{patient_id:'P1',fev1_pct:55,fvc_pct:80,smoking_pack_years:30,symptoms:'chronic_cough_dyspnea',exacerbations_per_year:1}],
  ['p_exa','/api/pulm_copd/exacerbation',{patient_id:'P2',copd_severity:'gold_d',exacerbation_type:'moderate',trigger:'infection',spo2:88,ph:7.35,treated_with:'steroids_antibiotics'}],
  ['p_o2','/api/pulm_copd/oxygen_therapy',{patient_id:'P3',spo2_rest:88,spo2_exercise:84,ltot_indicated:true,oxygen_flow_l_min:2,oxygen_duration_h:18}],
  ['p_reh','/api/pulm_copd/pulmonary_rehab',{patient_id:'P4',program_enrolled:true,sessions_completed:24,walk_distance_m:450,dyspnea_score:5,adherence:'good'}],
  ['p_sm','/api/pulm_copd/smoking_cessation',{patient_id:'P5',cigarettes_per_day:20,years_smoking:30,nicotine_replacement:true,varenicline_started:false,cessation_attempt:'active'}],

  ['p_ac','/api/pulm_asthma/asthma_control',{patient_id:'A1',act_score:18,fev1_pct:80,nocturnal_symptoms:1,reliever_use_per_week:2,control_level:'well_controlled'}],
  ['p_bio','/api/pulm_asthma/biologic_therapy',{patient_id:'A2',biologic:'omalizumab',ige_level:350,eosinophil_count:300,response:'partial',duration_months:6}],
  ['p_sev','/api/pulm_asthma/severe_asthma',{patient_id:'A3',gina_step:5,exacerbations_per_year:4,maintenance_ocs:true,biologic_indicated:true,comorbidities:'rhinosinusitis'}],
  ['p_ap','/api/pulm_asthma/asthma_action_plan',{patient_id:'A4',plan_in_writing:true,peak_flow_personal_best:450,green_zone_pct:80,yellow_zone_trigger:'reliever_use_increase',red_zone_action:'start_ocs_call'}],
  ['p_oa','/api/pulm_asthma/occupational_asthma',{patient_id:'A5',workplace_exposure:'isocyanates',pft_baseline:85,pft_work:65,sensitization_test:'positive',workplace_modification:true}],

  ['p_stu','/api/pulm_sleep/sleep_study',{patient_id:'S1',study_type:'home_sleep_apnea_test',ahi:18,odi:15,spo2_nadir:82,sleep_efficiency_pct:78,study_quality:'adequate'}],
  ['p_osa','/api/pulm_sleep/osa_severity',{patient_id:'S2',ahi:24,osa_severity:'moderate',symptoms:'daytime_sleepiness',comorbidities:'hypertension',cpap_prescribed:true}],
  ['p_tit','/api/pulm_sleep/cpap_titration',{patient_id:'S3',titration_type:'in_lab',optimal_pressure_cm_h2o:9,ahi_on_pressure:3,leak_l_per_min:24,mask_fit:'good',adherence_predicted:'good'}],
  ['p_hyg','/api/pulm_sleep/sleep_hygiene',{patient_id:'S4',sleep_hours:6,bedtime_consistent:false,caffeine_after_noon:true,exercise_regularly:false,screen_time_bed:90}],
  ['p_med','/api/pulm_sleep/sleep_medication',{patient_id:'S5',medication:'melatonin',dose:3,chronic_use:false,fall_risk:false,next_review_2_weeks:true}],

  ['p_ildc','/api/pulm_ild/ild_classification',{patient_id:'I1',ild_pattern:'uip',ct_findings:'honeycombing',biopsy_done:true,etiology:'ip',severity:'moderate'}],
  ['p_ildp','/api/pulm_ild/ild_progression',{patient_id:'I2',fvc_baseline:75,fvc_current:65,fvc_decline_pct:13,follow_up_months:6,progression:'declining'}],
  ['p_anti','/api/pulm_ild/antifibrotic_therapy',{patient_id:'I3',drug:'nintedanib',fvc_pct:65,tolerance:'good',side_effects:'mild_diarrhea',response:'stable'}],
  ['p_o2i','/api/pulm_ild/oxygen_ild',{patient_id:'I4',rest_spo2:90,exercise_spo2:84,oxygen_at_rest_l:2,oxygen_during_exercise_l:3,oxygen_hours_per_day:24}],
  ['p_ltx','/api/pulm_ild/lung_transplant_eval',{patient_id:'I5',age:58,fvc_pct:55,dlco_pct:35,transplant_referred:true,evaluation_status:'in_progress',six_min_walk:280}],

  ['p_vent','/api/pulm_pc/ventilator_management',{patient_id:'V1',mode:'pressure_control',peep:10,fio2:60,tidal_volume:6,plateau_pressure:30,oxygenation_index:200}],
  ['p_wean','/api/pulm_pc/weaning_protocol',{patient_id:'V2',rsbi:45,spontaneous_breathing_trial:true,trial_duration_min:120,passed_sbt:true,extubation_planned:true}],
  ['p_ards','/api/pulm_pc/ards_protocol',{patient_id:'V3',ards_severity:'moderate',peep:12,tidal_volume:6,plateau:28,driving_pressure:14,prone_positioning:true}],
  ['p_trach','/api/pulm_pc/tracheostomy',{patient_id:'V4',trach_day:7,indication:'prolonged_ventilation',trach_type:'percutaneous',speaking_valve_trials:true,swallowing_assessment:'pending'}],
  ['p_bronc','/api/pulm_pc/icu_bronchoscopy',{patient_id:'V5',indication:'secretion_clearance',findings:'thick_secretions',lavage_done:true,bal_results:'pending',complication:'none'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\pulm_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_pulm_tier32.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);