// filepath: gen_tier39.js
const fs = require('fs');

const routes = [
  [228, 'otology', 'hearing_loss,otitis_media,vertigo,tinnitus,cholesteatoma'],
  [229, 'rhinology', 'sinusitis,nasal_polyps,epistaxis,septal_deviation,allergic_rhinitis'],
  [230, 'laryngology', 'hoarseness,vocal_cord_nodules,subglottic_stenosis,laryngeal_cancer,tracheostomy_care'],
  [231, 'head_neck', 'thyroid_nodule_ent,salivary_gland_tumor,neck_mass,parotid_tumor,lymphadenopathy'],
  [232, 'ped_ent', 'adeno_tonsillectomy,recurrent_ear_infection,pediatric_airway,hearing_screen,pediatric_sinus'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier39_ent_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier39_ent_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier39_ent_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['e_hl','/api/ent_oto/hearing_loss',{patient_id:'O1',type:'sensorineural',side:'bilateral',severity:'moderate',audiogram_pta:45,tinnitus:false,hearing_aid:false}],
  ['e_om','/api/ent_oto/otitis_media',{patient_id:'O2',type:'acute',side:'right',effusion:true,tm_perforation:false,antibiotic:'amoxicillin',follow_up_4_weeks:true}],
  ['e_vert','/api/ent_oto/vertigo',{patient_id:'O3',type:'bppv',dix_hallpike:'positive',nystagmus:'torsional_upbeating',treatment:'epley_maneuver',response:'resolving'}],
  ['e_tin','/api/ent_oto/tinnitus',{patient_id:'O4',type:'subjective',side:'bilateral',duration_months:8,hearing_loss:false,audiogram_done:true,management:'sound_therapy'}],
  ['e_cho','/api/ent_oto/cholesteatoma',{patient_id:'O5',location:'attic',stage:'modified_sade_2',surgery_planned:'tympanoplasty_with_mastoidectomy',hearing_baseline:35,complication_known:true}],

  ['e_sin','/api/ent_rhino/sinusitis',{patient_id:'R1',type:'acute_bacterial',duration_weeks:3,sym:'purulent_discharge',antibiotic:'amoxicillin_clavulanate',ct_done:false}],
  ['e_np','/api/ent_rhino/nasal_polyps',{patient_id:'R2',grade:'grade_3',side:'bilateral',previous_surgery:false,biologics_candidate:true,asthma_comorbidity:true}],
  ['e_ep','/api/ent_rhino/epistaxis',{patient_id:'R3',side:'anterior',severity:'moderate',initial_bleeding:true,cauterization_done:true,anterior_pack:false,recurrence_risk:'moderate'}],
  ['e_sd','/api/ent_rhino/septal_deviation',{patient_id:'R4',type:'c_shaped',severity:'moderate',nasal_obstruction:true,trauma_history:false,surgical_candidate:true}],
  ['e_ar','/api/ent_rhino/allergic_rhinitis',{patient_id:'R5',type:'seasonal',ige:120,skin_test:'positive_grass',treatment:'antihistamine_intranasal_steroid',response:'partial'}],

  ['e_hoar','/api/ent_laryn/hoarseness',{patient_id:'L1',duration_weeks:8,smoker:true,reflux:false,flexible_laryngoscopy_done:true,lesion:'vocal_cord_polyp'}],
  ['e_vcn','/api/ent_laryn/vocal_cord_nodules',{patient_id:'L2',side:'bilateral',occupation:'teacher',voice_therapy_initiated:true,surgery_needed:false,follow_up_8_weeks:true}],
  ['e_sgs','/api/ent_laryn/subglottic_stenosis',{patient_id:'L3',severity:'grade_2_cotton',cause:'prolonged_intubation',intervention:'balloon_dilation',recurrence:'monitor',follow_up_4_weeks:true}],
  ['e_lc','/api/ent_laryn/laryngeal_cancer',{patient_id:'L4',stage:'t2_n0_m0',subsite:'glottic',hpv_related:false,treatment:'transoral_laser_microsurgery',smoking_cessation:true}],
  ['e_trach','/api/ent_laryn/tracheostomy_care',{patient_id:'L5',trach_age_weeks:12,decannulation_planning:true,swallow_assessment:'passed',first_trach_change_scheduled:true,humidification:true}],

  ['e_tne','/api/ent_hn/thyroid_nodule_ent',{patient_id:'H1',nodule_size_cm:1.4,tirads:'tr3',tsh:2.0,biopsy_indicated:true,cytology:'bethesda_iv'}],
  ['e_sg','/api/ent_hn/salivary_gland_tumor',{patient_id:'H2',location:'submandibular',size_cm:2.5,mri_done:true,benign_features:true,fnac:'pleomorphic_adenoma',surgery_planned:true}],
  ['e_nm','/api/ent_hn/neck_mass',{patient_id:'H3',location:'level_2',size_cm:3,imaging:'ct',constitutional_symptoms:false,fna_indicated:true,differential:'reactive_lymph_node'}],
  ['e_par','/api/ent_hn/parotid_tumor',{patient_id:'H4',location:'superficial_lobe',size_cm:2.8,fnac:'warthin_tumor',facial_nerve_baseline:'normal',surgery_planned:'superficial_parotidectomy'}],
  ['e_ln','/api/ent_hn/lymphadenopathy',{patient_id:'H5',region:'cervical',nodes_palpable:3,size_cm_node:1.5,tender:false,infectious_signs:false,imaging:'ultrasound',follow_up_4_weeks:true}],

  ['e_at','/api/ent_ped/adeno_tonsillectomy',{patient_id:'P1',age:7,indication:'recurrent_strep_6_per_year',snoring:true,sleep_study_done:false,complications:'none',planned:'outpatient'}],
  ['e_rei','/api/ent_ped/recurrent_ear_infection',{patient_id:'P2',age:4,infections_per_year:6,antibiotic_prophylaxis:false,tympanostomy_tubes_planned:true,speech_delay:false}],
  ['e_pa','/api/ent_ped/pediatric_airway',{patient_id:'P3',age:2,stridor:'biphasic',laryngoscopy:'subglottic_edema',severity:'mild',treatment:'observation'}],
  ['e_hs','/api/ent_ped/hearing_screen',{patient_id:'P4',age:2,abr_done:true,result:'mild_loss_bilateral',follow_up_6_months:true,early_intervention_referred:true}],
  ['e_ps','/api/ent_ped/pediatric_sinus',{patient_id:'P5',age:10,diagnosis:'chronic_rhinosinusitis',ct_sino_nasal:'mucosal_thickening',treatment:'irrigation_intranasal_steroid',adenoid_size:'moderate'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\ent_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_ent_tier39.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);