// filepath: gen_tier41.js
const fs = require('fs');

const routes = [
  [238, 'high_risk', 'preeclampsia,gestational_diabetes,placenta_previa,preterm_labor,intrauterine_growth_restriction'],
  [239, 'fetal_mon', 'non_stress_test,biophysical_profile,amniotic_fluid_index,doppler_ultrasound,fetal_heart_rate'],
  [240, 'ob_procedures', 'amniocentesis,cvs,cerclage,version,induction_labor'],
  [241, 'postpartum', 'postpartum_hemorrhage,postpartum_depression,puerperal_sepsis,wound_check,contraception_counseling'],
  [242, 'lactation', 'latching_problem,mastitis,low_milk_supply,weaning,breastfeeding_medication'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier41_obstetrics_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier41_obstetrics_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier41_obstetrics_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['o_pe','/api/ob_high_risk/preeclampsia',{patient_id:'P1',gestational_age_weeks:34,bp_systolic:160,bp_diastolic:105,proteinuria:'positive',lfts:80,platelets:100,severity:'severe'}],
  ['o_gd','/api/ob_high_risk/gestational_diabetes',{patient_id:'P2',gestational_age_weeks:28,gtt_1hr:180,gtt_2hr:155,gtt_3hr:140,fasting_glucose:100,treatment:'diet_exercise'}],
  ['o_pp','/api/ob_high_risk/placenta_previa',{patient_id:'P3',type:'complete',gestational_age_weeks:32,bleeding:true,previous_cs:1,delivery_planned:'cs_36_weeks'}],
  ['o_ptl','/api/ob_high_risk/preterm_labor',{patient_id:'P4',gestational_age_weeks:30,contractions:'regular',cervical_dilation:2,ffn_test:'positive',tocolysis_indicated:true}],
  ['o_iugr','/api/ob_high_risk/intrauterine_growth_restriction',{patient_id:'P5',estimated_fetal_weight:1200,percentile:4,umbilical_doppler:'abnormal',gestational_age_weeks:32,surveillance:'weekly'}],

  ['o_nst','/api/ob_fetal/non_stress_test',{patient_id:'F1',gestational_age_weeks:36,duration_min:20,accelerations:'present',baseline_fhr:140,result:'reactive'}],
  ['o_bpp','/api/ob_fetal/biophysical_profile',{patient_id:'F2',gestational_age_weeks:36,breathing:2,body_movement:2,muscle_tone:2,amniotic_fluid:2,nst:2,total:10}],
  ['o_afi','/api/ob_fetal/amniotic_fluid_index',{patient_id:'F3',afi:8,gestational_age_weeks:38,polyhydramnios:false,oligohydramnios:false,follow_up:1}],
  ['o_dop','/api/ob_fetal/doppler_ultrasound',{patient_id:'F4',umbilical_artery_s_d_ratio:3.5,ductus_venosus:'normal',middle_cerebral_artery:'normal',interpretation:'increased_resistance',surveillance:'weekly'}],
  ['o_fhr','/api/ob_fetal/fetal_heart_rate',{patient_id:'F5',baseline:140,variability:'moderate',accelerations:'present',decelerations:'none',category:'category_1'}],

  ['o_amn','/api/ob_procedures/amniocentesis',{patient_id:'A1',gestational_age_weeks:16,indication:'advanced_maternal_age',fluid_color:'clear',karyotype:'pending',complications:'none'}],
  ['o_cvs','/api/ob_procedures/cvs',{patient_id:'A2',gestational_age_weeks:12,placental_location:'posterior',sample_quality:'adequate',karyotype:'normal',complications:'none'}],
  ['o_cer','/api/ob_procedures/cerclage',{patient_id:'A3',gestational_age_weeks:14,type:'mcDonald',prior_loss:2,cervical_length_mm:18,placement_successful:true}],
  ['o_ver','/api/ob_procedures/version',{patient_id:'A4',gestational_age_weeks:37,presentation:'breech',version_type:'external_cephalic',success:true,fhr_post:'reassuring'}],
  ['o_ind','/api/ob_procedures/induction_labor',{patient_id:'A5',gestational_age_weeks:39,bishop_score:6,method:'misoprostol_then_oxytocin',response:'progressing',fhr:'reassuring'}],

  ['o_pph','/api/ob_postpartum/postpartum_hemorrhage',{patient_id:'PP1',estimated_blood_loss:1500,uterine_atony:true,treatment:'uterotonics_bakri_balloon',transfusion:2,response:'controlled'}],
  ['o_ppd','/api/ob_postpartum/postpartum_depression',{patient_id:'PP2',phq9_score:18,epds_score:15,sleep_disturbance:true,bonding_issues:true,suicidal_ideation:false,referral:'psychiatry'}],
  ['o_psep','/api/ob_postpartum/puerperal_sepsis',{patient_id:'PP3',temperature:39.5,source:'endometritis',wbc:22000,blood_culture:'positive_staph',antibiotics:'broad_spectrum',response:'improving'}],
  ['o_wc','/api/ob_postpartum/wound_check',{patient_id:'PP4',day_postpartum:7,site:'cs_incision',healing:'normal',seroma:false,infection_signs:false,staples_removal:false}],
  ['o_cc','/api/ob_postpartum/contraception_counseling',{patient_id:'PP5',breastfeeding:true,preferred:'iud',medical_eligible:true,initiated:'planned_6_weeks'}],

  ['o_lat','/api/ob_lactation/latching_problem',{patient_id:'L1',postpartum_day:5,latch_quality:'good',feeds_per_day:9,feed_duration_min:20,recommendation:'lactation_consultant'}],
  ['o_mas','/api/ob_lactation/mastitis',{patient_id:'L2',type:'lactational',temperature:38.5,affected_breast:'right',fluctuance:false,treatment:'antibiotics_continue_feeding',response:'improving'}],
  ['o_lms','/api/ob_lactation/low_milk_supply',{patient_id:'L3',feeds_per_day:8,wet_diapers:6,feed_weight_change:150,galactagogue:'none',supplementary_formula:false}],
  ['o_wea','/api/ob_lactation/weaning',{patient_id:'L4',child_age_months:12,weaning_type:'gradual',feeds_dropped:2,feeds_remaining:3,challenge:'none'}],
  ['o_med','/api/ob_lactation/breastfeeding_medication',{patient_id:'L5',medication:'amoxicillin',lactation_risk:'compatible',monitoring_required:false,alternative:'none'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\ob_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_ob_tier41.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);