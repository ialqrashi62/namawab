// filepath: gen_tier37.js
const fs = require('fs');

const routes = [
  [218, 'stroke', 'stroke_classification,tpa_eligibility,thrombectomy,secondary_prevention,stroke_rehab'],
  [219, 'epilepsy', 'epilepsy_diagnosis,asm_selection,status_epilepticus,epilepsy_surgery,eeg_review'],
  [220, 'ms', 'ms_diagnosis,ms_disease_modifying,ms_relapse,ms_progression,ms_symptom_management'],
  [221, 'movement', 'parkinson_diagnosis,deep_brain_stimulation,essential_tremor,dystonia,ataxia'],
  [222, 'neuro_musc', 'als_diagnosis,myasthenia,peripheral_neuropathy,muscular_dystrophy,autonomic_dysfunction'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier37_neurology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier37_neurology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier37_neurology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['n_sc','/api/neuro_stroke/stroke_classification',{patient_id:'S1',nihss:8,onset_min:120,occlusion_vessel:'mca',ct_hemorrhage:false,classification:'ischemic'}],
  ['n_tpa','/api/neuro_stroke/tpa_eligibility',{patient_id:'S2',age:65,onset_min:120,bp_systolic:160,glucose:120,prior_ich:false,anticoagulation:'none',indication:'tpa'}],
  ['n_thr','/api/neuro_stroke/thrombectomy',{patient_id:'S3',nihss:18,occlusion:'ica_terminal',onset_to_puncture_min:240,successful_reperfusion:true,complication:'none'}],
  ['n_sp','/api/neuro_stroke/secondary_prevention',{patient_id:'S4',etiology:'large_artery',antiplatelet:'clopidogrel',statin:'high_intensity',bp_target:130,anticoagulation:'none'}],
  ['n_sr','/api/neuro_stroke/stroke_rehab',{patient_id:'S5',days_post_stroke:7,fim_score:65,pt_intensity:'high',swallow_assessment:'passed',discharge_destination:'rehab_unit'}],

  ['n_ed','/api/neuro_epi/epilepsy_diagnosis',{patient_id:'E1',seizure_type:'focal_impaired_awareness',eeg_finding:'left_temporal_sharp',mri_finding:'hippocampal_sclerosis',duration_years:3,epilepsy_confirmed:true}],
  ['n_as','/api/neuro_epi/asm_selection',{patient_id:'E2',age:30,seizure_type:'focal_impaired_awareness',sex:'female',comorbid:'none',first_drug:'lamotrigine',side_effects:'none',response:'seizure_free'}],
  ['n_se','/api/neuro_epi/status_epilepticus',{patient_id:'E3',duration_min:25,phase:'established',first_line_taken:true,second_line:'levetiracetam',intubation:false,etiology:'unknown'}],
  ['n_ess','/api/neuro_epi/epilepsy_surgery',{patient_id:'E4',type:'temporal_lobectomy',mri_lesion:'hippocampal_sclerosis',eeg_focus:'left_temporal',candidate:'ideal',engel_outcome:'ia'}],
  ['n_eeg','/api/neuro_epi/eeg_review',{patient_id:'E5',eeg_finding:'focal_slowing',ictal_pattern:'absent',interpretation:'epileptiform_abnormalities',recommendation:'mri_consideration'}],

  ['n_mdd','/api/neuro_ms/ms_diagnosis',{patient_id:'M1',mri_lesion_count:8,oligoclonal_bands:'positive',evoked_potentials_abnormal:true,diagnosis:'rrms',duration_months:12}],
  ['n_dm','/api/neuro_ms/ms_disease_modifying',{patient_id:'M2',dmts:'ocrelizumab',relapse_rate_baseline:2,relapse_rate_treatment:0.5,monitoring_complete:true,jc_virus_negative:true}],
  ['n_mr','/api/neuro_ms/ms_relapse',{patient_id:'M3',relapse_severity:'moderate',symptoms:'optic_neuritis',steroid_treatment:'iv_methylprednisolone',response:'improving',rehabilitation:false}],
  ['n_mp','/api/neuro_ms/ms_progression',{patient_id:'M4',edss_baseline:2.5,edss_current:5.5,disease_course:'spms',progression_years:8,mri_burden_high:true}],
  ['n_sm','/api/neuro_ms/ms_symptom_management',{patient_id:'M5',symptom:'spasticity',treatment:'baclofen',response:'partial',fatigue_management:'amantadine',cognition_reviewed:true}],

  ['n_pd','/api/neuro_mov/parkinson_diagnosis',{patient_id:'P1',tremor:'resting_tremor_right',rigidity:true,bradykinesia:true,postural_instability:true,age_at_onset:62,diagnosis:'idiopathic_pd'}],
  ['n_dbs','/api/neuro_mov/deep_brain_stimulation',{patient_id:'P2',target:'stn',indication:'motor_fluctuations',duration_years_pd:10,response_pre:'wearing_off',response_post:'good',complication:'none'}],
  ['n_et','/api/neuro_mov/essential_tremor',{patient_id:'P3',tremor_type:'kinetic',family_history:true,alcohol_response:true,propranolol_trial:true,response:'partial'}],
  ['n_dy','/api/neuro_mov/dystonia',{patient_id:'P4',type:'cervical',age_at_onset:45,botox_treatment:true,response:'good',deep_brain_stimulation:false,response:'moderate'}],
  ['n_at','/api/neuro_mov/ataxia',{patient_id:'P5',type:'cerebellar',mri_finding:'cerebellar_atrophy',genetic_test:'friedreich_negative',progression:'slow',rehab:false}],

  ['n_als','/api/neuro_nm/als_diagnosis',{patient_id:'A1',als_fRS_baseline:35,site_onset:'limb',emg_finding:'active_denervation',diagnosis:'definite_als',riluzole_started:true}],
  ['n_my','/api/neuro_nm/myasthenia',{patient_id:'A2',achr_ab:'positive',symptoms:'ocular_limb',myasthenia_severity:'mild',treatment:'pyridostigmine',response:'good'}],
  ['n_pn','/api/neuro_nm/peripheral_neuropathy',{patient_id:'A3',type:'diabetic',emg_ncs:'sensorimotor_axonal',diabetes_duration_years:12,pain_treatment:'gabapentin',balance_review:true}],
  ['n_md','/api/neuro_nm/muscular_dystrophy',{patient_id:'A4',type:'duchenne',genetic_test:'positive_deletion',ambulatory:true,steroid_treatment:'prednisone',cardiac_screening:true}],
  ['n_ad','/api/neuro_nm/autonomic_dysfunction',{patient_id:'A5',symptoms:'orthostatic_intolerance',bp_drop:30,heart_rate_variability:false,tilt_table:'positive',treatment:'midodrine_fludrocortisone'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\neuro_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_neuro_tier37.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);