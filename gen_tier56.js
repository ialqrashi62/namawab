// filepath: gen_tier56.js
const fs = require('fs');

const routes = [
  [313, 'surg_neuro', 'craniotomy,spinal_fusion_neuro,tumor_resection_brain,vascular_neuro,functional_neurosurg'],
  [314, 'surg_plastic', 'reconstruction_free_flap,cosmetic_rhinoplasty,breast_reconstruction,hand_surgery,burn_reconstruction'],
  [315, 'surg_urology', 'prostatectomy,nephrectomy,cystectomy,ureteroscopy,laser_prostate'],
  [316, 'surg_ent_surg', 'thyroidectomy,parathyroidectomy,neck_dissection,tonsillectomy_bleeding,sinus_surgery'],
  [317, 'surg_thoracic', 'lobectomy_lung,pneumonectomy,wedge_resection,mediastinoscopy,esophagectomy'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier56_surgical_specialties_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier56_surgical_specialties_${n}_${name}_engine');
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
  fs.writeFileSync('tier56_surgical_specialties_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['s_cra','/api/surg_neuro/craniotomy',{patient_id:'SN1',indication:'malignant_glioma_left_frontal',approach:'awake_craniotomy',extent_of_resection:'gross_total',iop_monitoring:false,complications:'none','follow_up_imaging_weeks':6}],
  ['s_sfn','/api/surg_neuro/spinal_fusion_neuro',{patient_id:'SN2','level':'l4_l5','indication':'spondylolisthesis_spine_instability','approach':'plif',instrumentation:'pedicle_screws_cage','levels_fused':1,'complications':'none'}],
  ['s_tum','/api/surg_neuro/tumor_resection_brain',{patient_id:'SN3','type':'glioma','location':'temporal_lobe','extent':'gross_total','neuromonitoring':'motor_emap','residual':'none_mri_24h','molecular':true}],
  ['s_vas','/api/surg_neuro/vascular_neuro',{patient_id:'SN4','condition':'aneurysm_left_aca','clipping_vs_coiling':'surgical_clipping','surgical_approach':'pterional','temporary_clip_time_min':7,'complications':'none'}],
  ['s_fun','/api/surg_neuro/functional_neurosurg',{patient_id:'SN5','indication':'parkinson_dyskinesia','procedure':'deep_brain_stimulation','target':'stn_bilateral','success':true,'complications':'none'}],

  ['s_re','/api/surg_plastic/reconstruction_free_flap',{patient_id:'SP1','type':'anterolateral_thigh','indication':'head_neck_reconstruction','donor_morbidity':'minimal','recipient_vessels':'facial_arries_success','flap_viability':'complete','follow_up_weeks':4}],
  ['s_rhi','/api/surg_plastic/cosmetic_rhinoplasty',{patient_id:'SP2','approach':'open','type':'primary_reduction','grafts':'septal','functional_improvement':true,'cosmetic_improvement':true,'complications':'minor_swelling_expected'}],
  ['s_br','/api/surg_plastic/breast_reconstruction',{patient_id:'SP3','type':'diep_flap_bilateral','timing':'immediate','mastectomy_type':'nipple_sparing','sentinel_node':true,'success':true,'follow_up_months':6}],
  ['s_hn','/api/surg_plastic/hand_surgery',{patient_id:'SP4','indication':'carpal_tunnel_release','procedure':'endoscopic_release','side':'right','functional_outcome':'excellent','complications':'none'}],
  ['s_bur','/api/surg_plastic/burn_reconstruction',{patient_id:'SP5','timing':'acute','defect_location':'upper_extremity','technique':'split_thickness_skin_graft','graft_take_pct':95,'complications':'none'}],

  ['s_pro','/api/surg_urology/prostatectomy',{patient_id:'SU1','approach':'robotic_assisted','indication':'prostate_cancer_t2','nerve_sparing':'bilateral','lymph_node_dissection':'extended','pathology':'organ_confined','continence':'full_at_3_months'}],
  ['s_nep','/api/surg_urology/nephrectomy',{patient_id:'SU2','approach':'robotic_partial','indication':'t1b_tumor_left','warm_ischemia_min':18,'margin':'negative','complications':'none'}],
  ['s_cys','/api/surg_urology/cystectomy',{patient_id:'SU3','approach':'robotic_radical_with_intracorporeal_ileal_conduit','indication':'muscle_invasive_bladder_cancer','lymph_node_count':18,'complications':'none'}],
  ['s_ure','/api/surg_urology/ureteroscopy',{patient_id:'SU4','indication':'distal_ureteral_stone_8mm','approach':'flexible','stone_clearance':'complete','stent_placed':'planned_removal_2_weeks','complications':'none'}],
  ['s_las','/api/surg_urology/laser_prostate',{patient_id:'SU5','procedure':'holmium_laser_enucleation','prostate_size_g':85,'tissue_enucleated_g':80,'catheter_removal_days':2,'complications':'mild_stress_incontinence_resolving'}],

  ['s_thy','/api/surg_ent_surg/thyroidectomy',{patient_id:'SE1','indication':'papillary_thyroid_cancer','extent':'total','central_neck_dissection':'right','recurrent_laryngeal_nerve_monitoring':true,'calcium_post_op':'normal','complications':'none'}],
  ['s_par','/api/surg_ent_surg/parathyroidectomy',{patient_id:'SE2','indication':'primary_hyperparathyroidism','localization':'sestamibi_positive','exploration':'minimally_invasive_focused','calcium_post_op':9.5,'success':true}],
  ['s_nec','/api/surg_ent_surg/neck_dissection',{patient_id:'SE3','type':'selective_left_levels_2_3','indication':'oral_cavity_squamous','lymph_nodes_positive':2,'lymph_nodes_total':18,'complications':'none'}],
  ['s_tnb','/api/surg_ent_surg/tonsillectomy_bleeding',{patient_id:'SE4','timing':'postoperative_day_5','severity':'moderate_active_bleeding','management':'emergent_return_to_or_cautery','transfusion':false,'discharge_days':1}],
  ['s_sin','/api/surg_ent_surg/sinus_surgery',{patient_id:'SE5','indication':'chronic_rhinosinusitis_with_polyps','approach':'functional_endoscopic','extent':'bilateral_complete','navigation_used':true,'complications':'none'}],

  ['s_lob','/api/surg_thoracic/lobectomy_lung',{patient_id:'ST1','approach':'vats','indication':'stage_ia2_adenocarcinoma','lobe':'right_upper','lymph_nodes_stations':4,'complications':'none','length_of_stay_days':3}],
  ['s_pne','/api/surg_thoracic/pneumonectomy',{patient_id:'ST2','side':'left','indication':'centrally_located_squamous','approach':'thoracotomy','lymph_nodes_stations':6,'complications':'none'}],
  ['s_wed','/api/surg_thoracic/wedge_resection',{patient_id:'ST3','approach':'vats','indication':'metastasectomy_colorectal','lesion_count':2,'location':'right_lower','margins':'negative','complications':'none'}],
  ['s_med','/api/surg_thoracic/mediastinoscopy',{patient_id:'ST4','indication':'mediastinal_lymphadenopathy','stations_sampled':'4_5_7','complications':'none','follow_up_pathology':'pending'}],
  ['s_eso','/api/surg_thoracic/esophagectomy',{patient_id:'ST5','approach':'ivor_lewis','indication':'distal_esophageal_adenocarcinoma','reconstruction':'gastric_pullup','anastomosis':'intrathoracic','complications':'minor_anastomotic_stricture_managed_endoscopically'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\ssg_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_ssg_tier56.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);