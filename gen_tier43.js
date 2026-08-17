// filepath: gen_tier43.js
const fs = require('fs');

const routes = [
  [248, 'gi_surg', 'cholecystectomy,appendectomy,hernia_repair,colectomy,gastric_bypass'],
  [249, 'ortho_surg', 'arthroplasty,fracture_fixation,spinal_fusion,arthroscopy,amputation'],
  [250, 'vascular', 'aaa_repair,carotid_endarterectomy,bypass_graft,varicose_vein,emoblization'],
  [251, 'trauma', 'damage_control_lap,fasciotomy,thoracotomy,neck_exploration,pelvic_packing'],
  [252, 'transplant', 'renal_transplant,liver_transplant,heart_transplant,lung_transplant,pancreas_transplant'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier43_surgery_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier43_surgery_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier43_surgery_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['s_chol','/api/surg_gi/cholecystectomy',{patient_id:'S1',approach:'laparoscopic',indication:'symptomatic_stones',op_time_min:90,ebl:50,length_of_stay_days:1,complications:'none'}],
  ['s_app','/api/surg_gi/appendectomy',{patient_id:'S2',approach:'laparoscopic',indication:'acute_appendicitis',op_time_min:60,ebl:20,length_of_stay_days:1,complications:'none'}],
  ['s_her','/api/surg_gi/hernia_repair',{patient_id:'S3',type:'inguinal',approach:'laparoscopic_tep',mesh_used:true,op_time_min:75,length_of_stay_days:0,complications:'none'}],
  ['s_col','/api/surg_gi/colectomy',{patient_id:'S4',type:'right_hemicolectomy',indication:'cancer',approach:'laparoscopic',op_time_min:180,ebl:150,length_of_stay_days:5,complications:'ileus_resolved'}],
  ['s_gas','/api/surg_gi/gastric_bypass',{patient_id:'S5',type:'roux_en_y',bmi:42,comorbidities:'diabetes_htn',op_time_min:210,length_of_stay_days:3,complications:'none'}],

  ['s_art','/api/surg_ortho/arthroplasty',{patient_id:'O1',joint:'hip',approach:'posterior',prosthesis:'cementless',op_time_min:120,ebl:300,length_of_stay_days:3,complications:'none'}],
  ['s_frx','/api/surg_ortho/fracture_fixation',{patient_id:'O2',bone:'tibia',fracture_type:'comminuted',fixation:'intramedullary_nail',op_time_min:150,weight_bearing:'partial',complications:'none'}],
  ['s_spn','/api/surg_ortho/spinal_fusion',{patient_id:'O3',level:'l4_l5',indication:'spondylolisthesis',approach:'plif',levels_fused:1,op_time_min:240,ebl:500,complications:'none'}],
  ['s_art','/api/surg_ortho/arthroscopy',{patient_id:'O4',joint:'knee',procedure:'meniscus_repair',op_time_min:60,recovery_weeks:6,complications:'none'}],
  ['s_amp','/api/surg_ortho/amputation',{patient_id:'O5',level:'below_knee',indication:'diabetic_foot_with_sepsis',op_time_min:90,prosthesis_planned:true,rehab_weeks:12}],

  ['s_aaa','/api/surg_vasc/aaa_repair',{patient_id:'V1',type:'infrarenal',approach:'endovascular',size_cm:5.5,op_time_min:120,contrast_used:true,length_of_stay_days:2,complications:'none'}],
  ['s_car','/api/surg_vasc/carotid_endarterectomy',{patient_id:'V2',symptomatic:true,stenosis_pct:80,shunt_used:true,op_time_min:90,stroke_risk:'reduced',complications:'none'}],
  ['s_byp','/api/surg_vasc/bypass_graft',{patient_id:'V3',type:'femoropopliteal',graft:'saphenous_vein',indication:'claudication_critical_limb_ischemia',op_time_min:200,patency:'good',complications:'none'}],
  ['s_var','/api/surg_vasc/varicose_vein',{patient_id:'V4',approach:'endovenous_laser',vein:'great_saphenous',op_time_min:45,complications:'none',follow_up:2}],
  ['s_emb','/api/surg_vasc/emoblization',{patient_id:'V5',indication:'gi_bleeding',artery:'gastric',material:'coils',success:true,complications:'none'}],

  ['s_dcl','/api/surg_trauma/damage_control_lap',{patient_id:'T1',indication:'hypotensive_peritonitis',packs_count:4,resuscitation:'massive_transfusion',reoperation:'planned_24h',status:'stabilized'}],
  ['s_fas','/api/surg_trauma/fasciotomy',{patient_id:'T2',compartment:'leg',cause:'crush_injury',fasciotomy_type:'two_incision',delayed_closure:false,complications:'none'}],
  ['s_tho','/api/surg_trauma/thoracotomy',{patient_id:'T3',indication:'hemothorax',side:'left',ebl:2000,resuscitation:'massive_transfusion',status:'controlled'}],
  ['s_nec','/api/surg_trauma/neck_exploration',{patient_id:'T4',zone:'zone_2',injury_type:'platysma_violation',approach:'collar_incision',findings:'none_explored_negative',complications:'none'}],
  ['s_pel','/api/surg_trauma/pelvic_packing',{patient_id:'T5',fracture_type:'open_book',approach:'suprapubic_extrapertioneal',packing_count:3,angioembolization:true,stabilization:'external_fixator'}],

  ['s_ren','/api/surg_transplant/renal_transplant',{patient_id:'TX1',donor_type:'deceased',recipient_blood_group:'O_positive',crossmatch:'negative',cold_ischemia_hours:12,induction:'basiliximab',complications:'none'}],
  ['s_lvr','/api/surg_transplant/liver_transplant',{patient_id:'TX2',meld_score:32,donor_type:'deceased',cold_ischemia_hours:8,blood_loss:1500,complications:'none',follow_up:'daily'}],
  ['s_hrt','/api/surg_transplant/heart_transplant',{patient_id:'TX3',indication:'ischemic_cardiomyopathy',donor_age:35,crossmatch:'negative',ischemic_time_min:180,induction:'thymoglobulin',complications:'none'}],
  ['s_lng','/api/surg_transplant/lung_transplant',{patient_id:'TX4',type:'single',indication:'ipf',donor_age:45,ischemic_time_min:300,induction:'basiliximab',complications:'none'}],
  ['s_pan','/api/surg_transplant/pancreas_transplant',{patient_id:'TX5',simultaneous_kidney:true,indication:'type_1_diabetes_with_renal_failure',drainage:'enteric',immunosuppression:'tacrolimus_myfortic',complications:'none'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\sg_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_surg_tier43.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);