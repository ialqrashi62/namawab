// filepath: gen_tier50.js
const fs = require('fs');

const routes = [
  [283, 'card_failure', 'heart_failure_hfpef,heart_failure_hfref,cardiomyopathy,acute_decompensated_hf,advanced_heart_failure'],
  [284, 'card_arr', 'atrial_fibrillation,supraventricular_tachy,ventricular_tachycardia,bradycardia,channelopathies'],
  [285, 'card_valve', 'aortic_stenosis,mitral_regurg,tricuspid_regurg,pulmonary_stenosis,prosthetic_valve'],
  [286, 'card_ischemic', 'stemi,nstemi_acs,unstable_angina,stable_angina,prinzmetal_angina'],
  [287, 'card_cong', 'atrial_septal_defect,ventricular_septal_defect,patent_ductus,coarctation_aorta,tetralogy'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier50_cardiology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier50_cardiology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier50_cardiology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['c_hfp','/api/card_failure/heart_failure_hfpef',{patient_id:'C1',ef_percent:55,nyha_class:2,bnp:380,diastolic_dysfunction:'grade_2',htn:true,diabetes:true,therapy:'diuretic_sglt2_inhibitor'}],
  ['c_hfr','/api/card_failure/heart_failure_hfref',{patient_id:'C2',ef_percent:25,nyha_class:3,bnp:1200,ldl:140,on_target_dose:0.5,device:'icd_planned',prognosis:'moderate'}],
  ['c_cmp','/api/card_failure/cardiomyopathy',{patient_id:'C3',type:'dilated',ef_percent:30,etiology:'idiopathic_viral_suspected',family_history:false,genetic_testing:'panel_pending',device:'icd_considered'}],
  ['c_adh','/api/card_failure/acute_decompensated_hf',{patient_id:'C4',presenting_bp:110,weight_gain_kg:4,creatinine:1.4,iv_diuretic_bolus:'furosemide_80mg',response:'adequate_diuresis',monitoring:'strict_i_and_o'}],
  ['c_adv','/api/card_failure/advanced_heart_failure',{patient_id:'C5',nyha_class:4,on_inotropes:true,renal_function_worsening:true,intermacs:3,evaluation_for_lvad_or_transplant:'active'}],

  ['c_afb','/api/card_arr/atrial_fibrillation',{patient_id:'CR1',rhythm:'afib_rvr',ventricular_rate:140,chads_vasc:3,has_bled:1,anticoagulation:'apixaban',rate_control:'metoprolol',rhythm_control:'amiodarone_consideration'}],
  ['c_svt','/api/card_arr/supraventricular_tachy',{patient_id:'CR2',type:'avnrt',rate:180,hemodynamic:'stable',intervention:'vagal_maneuvers_then_adenosine',response:'converted_to_sinus',follow_up:'ep_study_consideration'}],
  ['c_vt','/api/card_arr/ventricular_tachycardia',{patient_id:'CR3',type:'monomorphic_sustained',rate:220,hemodynamic:'unstable',intervention:'synchronized_cardioversion',success:true,follow_up:'icd_evaluation'}],
  ['c_brd','/api/card_arr/bradycardia',{patient_id:'CR4',type:'complete_av_block',rate:32,symptom:'syncope',pacemaker_type:'dual_chamber',implant_success:true}],
  ['c_chl','/api/card_arr/channelopathies',{patient_id:'CR5',condition:'long_qt_syndrome',qtc_ms:520,trigger:'exercise',genetic_test:'kcnq1_positive',beta_blocker_therapy:'nadolol',activity_restrictions:'avoid_strenuous_exercise'}],

  ['c_as','/api/card_valve/aortic_stenosis',{patient_id:'CV1',severity:'severe',mean_gradient_mmhg:52,valve_area_cm2:0.7,ef_percent:55,symptoms:'symptomatic',intervention:'tavr_planned'}],
  ['c_mr','/api/card_valve/mitral_regurg',{patient_id:'CV2',severity:'severe',etiology:'degenerative',ef_percent:50,lvesd_mm:38,symptoms:'symptomatic',intervention:'mitral_clip_or_repair'}],
  ['c_tr','/api/card_valve/tricuspid_regurg',{patient_id:'CV3',severity:'severe',etiology:'functional_annular_dilation',symptoms:'edema_ascites',intervention:'diuretic_therapy_transcatheter_repair_consideration'}],
  ['c_ps','/api/card_valve/pulmonary_stenosis',{patient_id:'CV4',severity:'moderate',peak_gradient_mmhg:35,valve_area_cm2:1.2,symptoms:'asymptomatic',intervention:'balloon_valvuloplasty_consideration'}],
  ['c_pv','/api/card_valve/prosthetic_valve',{patient_id:'CV5',valve_type:'mechanical_bileaflet',position:'aortic',anticoagulation:'warfarin_inr_target_2_5',complications:'none',follow_up:12}],

  ['c_ste','/api/card_ischemic/stemi',{patient_id:'CI1',pain_to_door_min:45,culprit_artery:'lad',door_to_balloon_min:60,ef_percent_post:45,outcome:'successful_pci',discharge_meds:'dual_antiplatelet_statin_bbl_acei'}],
  ['c_nst','/api/card_ischemic/nstemi_acs',{patient_id:'CI2',troponin_peak:4.2,culprit_artery:'lcx',strategy:'early_invasive',intervention:'pci_with_drug_eluting_stent',risk_score_grace:115}],
  ['c_una','/api/card_ischemic/unstable_angina',{patient_id:'CI3',troponin:'negative',ecg_changes:'st_depression_inferior',culprit_artery:'rca',strategy:'invasive','stress_test':'negative_post_pci'}],
  ['c_sta','/api/card_ischemic/stable_angina',{patient_id:'CI4',symptoms:'exertional_chest_pressure',functional_class:2,stress_test:'positive_mild_ischemia',intervention:'optimal_medical_therapy_first',ccta_planned:true}],
  ['c_pri','/api/card_ischemic/prinzmetal_angina',{patient_id:'CI5',trigger:'rest_at_night',ecg_during_pain:'st_elevation_anterior',coronary_angiography:'normal_cx',treatment:'ccb_nitrates',response:'complete_resolution'}],

  ['c_asd','/api/card_cong/atrial_septal_defect',{patient_id:'CC1',type:'secundum',size_mm:18,qp_qs_ratio:1.8,rv_dilation:true,closure:'transcatheter_occluder_planned'}],
  ['c_vsd','/api/card_cong/ventricular_septal_defect',{patient_id:'CC2',type:'perimembranous',size_mm:8,qp_qs_ratio:1.4,closure:'observation'}],
  ['c_pda','/api/card_cong/patent_ductus',{patient_id:'CC3',size_mm:4,type:'moderate',closure:'transcatheter_occluder_successful',complications:'none'}],
  ['c_coa','/api/card_cong/coarctation_aorta',{patient_id:'CC4',gradient_mmhg:30,location:'juxtaductal',treatment:'balloon_with_stent_planned',complications:'none',follow_up_imaging:6}],
  ['c_tof','/api/card_cong/tetralogy',{patient_id:'CC5',age_at_repair:'6_months',surgical_repair:'complete',current_pvr:'moderate',follow_up:'annual_echo_cath_prn',residual_lesions:'mild_pulmonary_regurg'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\car_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_car_tier50.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);