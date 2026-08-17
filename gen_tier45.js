// filepath: gen_tier45.js
const fs = require('fs');

const routes = [
  [258, 'icu_vent', 'ards,weaning_protocol,prone_ventilation,ecmo_evaluation,ventilator_associated_pneumonia'],
  [259, 'icu_sepsis', 'septic_shock,severe_sepsis,multidrug_resistant,fungal_sepsis_icu,catheter_sepsis'],
  [260, 'icu_hemodyn', 'shock_cardiogenic,shock_distributive,shock_obstructive,vasopressor_management,inotrope_management'],
  [261, 'icu_neuro', 'tbi_icu,status_epilepticus,icp_management,subarachnoid_icu,stroke_icu'],
  [262, 'icu_renal', 'aki_icu,crrt,fluid_resuscitation,electrolyte_emergency,acid_base'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier45_icu_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier45_icu_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier45_icu_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['i_ards','/api/icu_vent/ards',{patient_id:'I1',pao2_fio2:120,fio2:0.7,peep:14,tidal_volume:6,prone_positioning:true,severity:'severe',mortality_risk:'high'}],
  ['i_wean','/api/icu_vent/weaning_protocol',{patient_id:'I2',rsbi:60,oxygen_sat:97,fio2:0.4,peep:5,mental_status:'alert_responsive',trial_outcome:'pass_extubate'}],
  ['i_pron','/api/icu_vent/prone_ventilation',{patient_id:'I3',pao2_fio2:80,duration_hours:18,response:'improvement',complications:'none',sessions_planned:true}],
  ['i_ecmo','/api/icu_vent/ecmo_evaluation',{patient_id:'I4',age:42,comorbidities:'none',pao2_fio2:60,rescue_therapy:true,indication:'severe_ards',outcome:'candidate_yes'}],
  ['i_vap','/api/icu_vent/ventilator_associated_pneumonia',{patient_id:'I5',cpis_score:7,secretions:'purulent',culture:'pseudomonas',antibiotics:'cefepime_aminoglycoside',response:'improving'}],

  ['i_ssh','/api/icu_sepsis/septic_shock',{patient_id:'IS1',lactate:5.2,map:55,fluid_bolus_l:4,norepinephrine:true,source:'abdominal',mortality:'high'}],
  ['i_ssv','/api/icu_sepsis/severe_sepsis',{patient_id:'IS2',lactate:3.5,wbc:18000,organ_dysfunction:'renal',source:'pneumonia',antibiotics:'broad_spectrum',response:'improving'}],
  ['i_mdr','/api/icu_sepsis/multidrug_resistant',{patient_id:'IS3',organism:'mrsa',resistance_pattern:'mrsa_vre',antibiotics:'vancomycin_linezolid',de_escalation:'planned',isolation:'contact'}],
  ['i_fng','/api/icu_sepsis/fungal_sepsis_icu',{patient_id:'IS4',organism:'candida',galactomannan:0.6,echinocandin:true,source:'line_related',response:'improving'}],
  ['i_cath','/api/icu_sepsis/catheter_sepsis',{patient_id:'IS5',line_type:'central',days_in_place:9,organism:'staph_coag_neg',treatment:'line_removal_vancomycin',response:'clearing'}],

  ['i_sck','/api/icu_hemodyn/shock_cardiogenic',{patient_id:'IH1',ef:18,ci:1.7,pcwp:22,norepinephrine:true,vasopressin:false,mech_circulatory_support:'impella',mortality:'high'}],
  ['i_dst','/api/icu_hemodyn/shock_distributive',{patient_id:'IH2',etiology:'septic',svr:580,ci:3.6,norepinephrine:true,vasopressin:true,fluid_balance:'positive_4L'}],
  ['i_obs','/api/icu_hemodyn/shock_obstructive',{patient_id:'IH3',etiology:'massive_pe',cvp:25,intervention:'thrombolysis',response:'improving',anticoagulation:'heparin_gtt'}],
  ['i_vas','/api/icu_hemodyn/vasopressor_management',{patient_id:'IH4',agent:'norepinephrine',dose_mcg_kg_min:0.4,map_target:65,second_agent:'vasopressin',weaning_plan:'dose_reduction_when_stable'}],
  ['i_ino','/api/icu_hemodyn/inotrope_management',{patient_id:'IH5',agent:'dobutamine',dose_mcg_kg_min:8,ef:25,rhythm:'sinus_tachycardia',monitoring:'continuous_echo'}],

  ['i_tbi','/api/icu_neuro/tbi_icu',{patient_id:'IN1',gcs:6,severity:'severe',icp:24,interventions:'osmotherapy_decompressive_craniectomy',monitoring:'continuous_icp'}],
  ['i_se','/api/icu_neuro/status_epilepticus',{patient_id:'IN2',type:'convulsive',duration_min:25,first_line:'benzodiazepine',second_line:'levetiracetam',third_line:'propofol_icu'}],
  ['i_icp','/api/icu_neuro/icp_management',{patient_id:'IN3',icp_baseline:18,current_icp:24,cpp:55,treatment:'sedation_osmotherapy_positioning',decompressive:'considered'}],
  ['i_sah','/api/icu_neuro/subarachnoid_icu',{patient_id:'IN4',hunt_hess:3,fisher:3,aneurysm_location:'aca',treatment:'coiling',nimodipine_started:true,monitoring:'transcranial_doppler'}],
  ['i_str','/api/icu_neuro/stroke_icu',{patient_id:'IN5',nihss:18,thrombectomy:true,door_to_puncture_min:65,monitoring:'neuro_q1h',complications:'none'}],

  ['i_aki','/api/icu_renal/aki_icu',{patient_id:'IR1',kdigo_stage:3,creatinine:4.2,urine_output:'oliguria',etiology:'septic',intervention:'crrt_started'}],
  ['i_crrt','/api/icu_renal/crrt',{patient_id:'IR2',mode:'cvvhdf',blood_flow:200,replacement:'balanced_solution',anticoagulation:'citrate',duration_hours:48}],
  ['i_flu','/api/icu_renal/fluid_resuscitation',{patient_id:'IR3',crystalloid:'balanced',volume_l:3,response:'improving_map',monitoring:'cvp_lactate',overload_risk:'low'}],
  ['i_ely','/api/icu_renal/electrolyte_emergency',{patient_id:'IR4',electrolyte:'potassium',value:7.1,severity:'severe',treatment:'insulin_dextrose_calcium_kayexalate',response:'correcting'}],
  ['i_aba','/api/icu_renal/acid_base',{patient_id:'IR5',ph:7.18,pco2:32,hco3:14,anion_gap:18,disturbance:'metabolic_acidosis_ag',treatment:'bicarbonate_crRT_considered'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\icu_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_icu_tier45.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);