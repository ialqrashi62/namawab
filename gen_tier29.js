// filepath: gen_tier29.js
const fs = require('fs');

const routes = [
  [178, 'stress', 'exercise_stress,nuclear_stress,echo_stress,ct_angio,ami_marker'],
  [179, 'echo', 'tte_assess,strain,tee_assess,pulmonary_htn,diastolic'],
  [180, 'cath', 'cath_plan,pci_outcome,tav,mitraclip,lad_revascularization'],
  [181, 'ep', 'afib_management,ablation,pacemaker,icd,anticoag_monitoring'],
  [182, 'hf', 'hf_classification,gdmt,lvad,pulmonary_h,transplant_bridge'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier29_cardiology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier29_cardiology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier29_cardiology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['c_es','/api/cardio_stress/exercise_stress',{test_id:'T1',protocol:'bruce',mets_achieved:10,max_hr_achieved:150,max_hr_predicted:170,st_changes:false,chest_pain:false,result:'negative'}],
  ['c_ns','/api/cardio_stress/nuclear_stress',{test_id:'N1',tracer:'sestamibi',perfusion:'normal',lvef_stress:60,lvef_rest:60,ischemic_volume_pct:2,risk_strat:'low'}],
  ['c_es2','/api/cardio_stress/echo_stress',{test_id:'ES1',lvef_rest:60,lvef_stress:65,wall_motion_score_index:1.0,response:'normal',valvular_significant:false,pulmonary_hypertension:false}],
  ['c_ct','/api/cardio_stress/ct_angio',{study_id:'CT1',calcium_score:50,severity:'mild',stenosis_max_pct:30,high_risk_plaque:false,recommendation:'routine_follow_up'}],
  ['c_ami','/api/cardio_stress/ami_marker',{assessment_id:'A1',troponin_peak:0.5,ck_mb:5,st_pattern:'normal',time_since_onset_min:120,reperfusion_given:false}],

  ['c_tte','/api/cardio_echo/tte_assess',{study_id:'TTE1',lvef:60,lv_function:'normal',rv_function:'normal',regurgitation_significant:false,valve_severity:'none',pericardial_effusion:false}],
  ['c_str','/api/cardio_echo/strain',{study_id:'ST1',gls:-20,age:55,sex:'male',lvef:60,cardiac_amyloid_pattern:false,hcm_pattern:false}],
  ['c_tee','/api/cardio_echo/tee_assess',{study_id:'TEE1',indication:'endocarditis',endocarditis:'no',vegetation_size_mm:0,ejection_fraction_visual:60,intracardiac_thrombus:false}],
  ['c_ph','/api/cardio_echo/pulmonary_htn',{study_id:'PH1',pasp:30,tap:2.0,ph_severity:'mild',right_ventricular_dilation:false,d_sign:false,tr_max_velocity:2.5}],
  ['c_dia','/api/cardio_echo/diastolic',{study_id:'D1',grade:'grade_1_impaired_relaxation',e_e_ratio:9,la_volume_index:32,tr_max_velocity:2.5,pulmonary_veins_reviewed:true}],

  ['c_cp','/api/cardio_cath/cath_plan',{procedure_id:'CP1',access:'radial',approach:'diagnostic_with_pci',door_to_balloon_min:60,findings:'single_vessel',timiflow:'3'}],
  ['c_pci','/api/cardio_cath/pci_outcome',{pci_id:'PCI1',stent_count:1,complication:'none',timi_post:true,fluoroscopy_min:15,contrast_ml:200}],
  ['c_tav','/api/cardio_cath/tav',{procedure_id:'TAV1',approach:'transfemoral',valve_type:'balloon_expandable',pre_baa:true,gradient_post:10,paravalvular_leak:'mild',conduction_disturbance:0}],
  ['c_mc','/api/cardio_cath/mitraclip',{procedure_id:'MC1',indication:'primary_mr',clips_deployed:1,post_mr_severity:'mild',strait_orifice_area:2.5,mlap:3}],
  ['c_rev','/api/cardio_cath/lad_revascularization',{episode_id:'R1',territory:'lad',syntax_score:12,diabetic:false,recommendation:'pci',stenosis_pct:80}],

  ['c_af','/api/cardio_ep/afib_management',{assessment_id:'AF1',afib_type:'paroxysmal',cha2ds2vasc:2,has_bled:1,rate_control:'beta_blocker',anticoagulation:'warfarin',rhythm_control_attempt:false}],
  ['c_abl','/api/cardio_ep/ablation',{procedure_id:'A1',type:'rf',duration_min:120,acute_success:true,complication:'none',recurrence_30d:false}],
  ['c_pm','/api/cardio_ep/pacemaker',{device_id:'PM1',type:'dual_chamber',indication:'av_block',complication:false,battery_voltage:3.0,lei_threshold_ok:true}],
  ['c_icd','/api/cardio_ep/icd',{device_id:'ICD1',indication:'primary_prevention',lvef:25,appropriate_shocks:false,inappropriate_shocks:false,lead_status:'normal'}],
  ['c_ac','/api/cardio_ep/anticoag_monitoring',{episode_id:'AC1',drug:'warfarin',dose:5,inr:2.5,days_on_drug:30,missed_doses:false,diet:'normal'}],

  ['c_hfc','/api/cardio_hf/hf_classification',{patient_id:'P1',nyha:'class_ii',acc_stage:'stage_c_symptomatic',lvef:35,phenotype:'hfref',ntprobnp:1200,hospitalized:false}],
  ['c_gd','/api/cardio_hf/gdmt',{patient_id:'P1',lvef:35,arni:'sacubitril_valsartan',beta_blocker:'carvedilol',mra:'spironolactone',sglt2:'dapagliflozin',k:4.2,creatinine:1.2}],
  ['c_lv','/api/cardio_hf/lvad',{assessment_id:'L1',phase:'destination_therapy',device:'hm3',lvef:20,complications:false,complication_type:'none'}],
  ['c_puh','/api/cardio_hf/pulmonary_h',{episode_id:'PH1',sbp:100,dbp:60,map:73,cvp:12,therapy:'diuretic',diuretic_dose:160}],
  ['c_tb','/api/cardio_hf/transplant_bridge',{assessment_id:'TB1',bridging_strategy:'inotrope',days_listed:90,meld:18,bnp:2000,status_1a:false}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\cardio_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_cardiology_tier29.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);