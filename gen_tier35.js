// filepath: gen_tier35.js
const fs = require('fs');

const routes = [
  [208, 'ra', 'ra_classification,ra_disease_activity,ra_dmards,ra_biologic,ra_joint_protection'],
  [209, 'lupus', 'sle_classification,sle_disease_activity,sle_renal,sle_neuropsychiatric,sle_pregnancy'],
  [210, 'vasculitis', 'anca_vasculitis,giant_cell_arteritis,takayasu,behcet,iga_vasculitis'],
  [211, 'myositis', 'dermatomyositis,antisynthetase,inclusion_body_myopathy,polymyalgia_rheumatica,myositis_ild'],
  [212, 'spine', 'ankylosing_spondylitis,axial_spondyloarthritis,psoriatic_arthritis,reactive_arthritis,enteropathic_arthritis'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier35_rheumatology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier35_rheumatology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier35_rheumatology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['r_rc','/api/rheum_ra/ra_classification',{patient_id:'R1',duration_weeks:8,symmetric:true,mcp_involved:true,rheumatoid_factor:'positive',anti_ccp:'positive',erosions_present:true}],
  ['r_da','/api/rheum_ra/ra_disease_activity',{patient_id:'R2',das28:4.5,cdai:25,sdai:30,patient_global:6,swollen_joints:8,tender_joints:12}],
  ['r_dm','/api/rheum_ra/ra_dmards',{patient_id:'R3',mtx_dose:20,leflunomide:false,hydroxychloroquine:true,monitoring_complete:true,alt:25,anc:5.0}],
  ['r_bio','/api/rheum_ra/ra_biologic',{patient_id:'R4',biologic:'etanercept',duration_months:12,response:'good',screening_tb_done:true,infection_signs:false}],
  ['r_jp','/api/rheum_ra/ra_joint_protection',{patient_id:'R5',hand_ot_referred:true,splint_use:true,exercise_program:true,work_modification:true,joint_surgery_planned:false}],

  ['r_sc','/api/rheum_lupus/sle_classification',{patient_id:'L1',malar_rash:true,photosensitivity:true,oral_ulcers:false,arthritis:true,serositis:false,renal:false,ana_positive:true,anti_dsdna:50}],
  ['r_sd','/api/rheum_lupus/sle_disease_activity',{patient_id:'L2',sledai:12,crp:8,anti_dsdna:120,c3:60,c4:15,flare_status:'moderate',treatment_needed:true}],
  ['r_lr','/api/rheum_lupus/sle_renal',{patient_id:'L3',proteinuria_g:3.5,creatinine:1.5,biopsy_class:'iv',induction:'mycophenolate',response:'partial',hematuria:true}],
  ['r_ln','/api/rheum_lupus/sle_neuropsychiatric',{patient_id:'L4',presentation:'seizure',mri_findings:'vasculitis',csf_normal:false,anti_ribosomal_p:50,immunosuppression_intensified:true}],
  ['r_lp','/api/rheum_lupus/sle_pregnancy',{patient_id:'L5',pregnancy:25,anti_ro_positive:true,anti_la_positive:false,active_disease:false,medications_compatible:true,monitoring_4_weeks:true}],

  ['r_av','/api/rheum_vasculitis/anca_vasculitis',{patient_id:'V1',anca_type:'pr3',creatinine:3.5,organ_invasion:'kidney_lung',induction:'rituximab',response:'improving',bv_score:18}],
  ['r_gca','/api/rheum_vasculitis/giant_cell_arteritis',{patient_id:'V2',age:72,esr:80,prednisone_started:true,dose_mg:60,temporal_biopsy:'positive',vision_symptoms:false}],
  ['r_tak','/api/rheum_vasculitis/takayasu',{patient_id:'V3',involved_vessels:'aorta_subclavian',imaging:'mra',disease_activity:'active',treatment:'tocilizumab',response:'stable'}],
  ['r_bec','/api/rheum_vasculitis/behcet',{patient_id:'V4',oral_ulcers:true,genital_ulcers:true,uveitis:true,pathergy:'positive',hla_b51:false,treatment:'azathioprine'}],
  ['r_iga','/api/rheum_vasculitis/iga_vasculitis',{patient_id:'V5',palpable_purpura:true,arthralgia:true,abdominal_pain:true,renal_involvement:false,biospy_done:true,treatment:'observation'}],

  ['r_dm1','/api/rheum_myo/dermatomyositis',{patient_id:'M1',heliotrope_rash:true,gottron_papules:true,proximal_weakness:true,ck:1500,anti_jo1:true,ild_present:true}],
  ['r_asy','/api/rheum_myo/antisynthetase',{patient_id:'M2',anti_jo1:'positive',ild:true,mechanics_hands:true,raynauds:true,fevers:true,treatment:'prednisone_ivig'}],
  ['r_ibm','/api/rheum_myo/inclusion_body_myopathy',{patient_id:'M3',age:65,progression_years:5,distal_weakness:true,ck_normal:false,biopsy_done:true,treatment:'observation'}],
  ['r_pmr','/api/rheum_myo/polymyalgia_rheumatica',{patient_id:'M4',age:70,shoulder_pain:true,hip_girdle_pain:true,esr:50,prednisone_response:'dramatic',dose_mg:15}],
  ['r_myi','/api/rheum_myo/myositis_ild',{patient_id:'M5',pattern:'nsip',fvc_pct:65,dlco_pct:55,treatment:'mycophenolate',response:'stable',oxygen_needed:false}],

  ['r_as','/api/rheum_spine/ankylosing_spondylitis',{patient_id:'S1',age:35,sacroiliac_inflammation:true,hla_b27:'positive',basdai:5,spinal_fusion_present:false}],
  ['r_axspa','/api/rheum_spine/axial_spondyloarthritis',{patient_id:'S2',imaging:'mri_positive',symptoms:'inflammatory_back_pain',nsaids_response:'good',biologic_indicated:true}],
  ['r_psa','/api/rheum_spine/psoriatic_arthritis',{patient_id:'S3',psoriasis_severity:'moderate',joint_count:8,axial_involvement:true,biologic_started:'secukinumab',response:'partial'}],
  ['r_reac','/api/rheum_spine/reactive_arthritis',{patient_id:'S4',trigger:'gi_infection',oligoarticular:true,urethritis:true,conjunctivitis:true,chronicity:'acute',treatment:'nsaids'}],
  ['r_ent','/api/rheum_spine/enteropathic_arthritis',{patient_id:'S5',ibd_type:'crohns',peripheral_arthritis:true,spondylitis:false,flare_synced:true,treatment:'tnf_inhibitor'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\rheum_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_rheum_tier35.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);