// filepath: gen_tier28.js
const fs = require('fs');

const routes = [
  [173, 'prenatal', 'prenatal_visit,prenatal_screening,ultrasound,high_risk_pregnancy,vaccination'],
  [174, 'labor', 'partogram,induction,fetal_monitoring,delivery,postpartum'],
  [175, 'gynecology', 'contraception,cervical_screening,menopause,abnormal_bleeding,pcos'],
  [176, 'neonatal', 'apgar,nrp,newborn_screen,thermoregulation,feeding_newborn'],
  [177, 'reproduction', 'infertility,ivf_cycle,transfer,ovulation,miscarriage'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier28_obstetrics_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier28_obstetrics_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier28_obstetrics_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['o_pv','/api/ob_prenatal/prenatal_visit',{visit_id:'V1',gestational_age_weeks:28,weight_kg:65,bp_systolic:120,bp_diastolic:80,urine_protein:0,fundal_height_cm:28,heart_tone:'present_normal',edema:false}],
  ['o_ps','/api/ob_prenatal/prenatal_screening',{screening_id:'S1',gestational_age_weeks:28,first_trimester_screen:true,cf_dna:true,quad_screen:true,gdm_screen:'normal',gbs_done:true}],
  ['o_us','/api/ob_prenatal/ultrasound',{us_id:'U1',gestational_age_weeks:20,us_type:'anatomy',efw_g:350,amniotic_fluid_index:14,fetal_anomaly:false}],
  ['o_hr','/api/ob_prenatal/high_risk_pregnancy',{patient_id:'P1',risk_factor:'diabetes',severity:'high',gestational_age_weeks:12,referral:'diabetes_clinic',plan_documented:true}],
  ['o_vac','/api/ob_prenatal/vaccination',{patient_id:'P1',vaccine:'tdap',gestational_age_weeks:30,contraindicated:false,timing:'third_trimester',documented:true}],

  ['o_par','/api/ob_labor/partogram',{labor_id:'L1',cervical_dilation_cm:5,station:0,contractions_per_10min:4,descent:'progressing',hours_in_labor:3,fetal_heart_rate:140,category_2_fhr:false}],
  ['o_ind','/api/ob_labor/induction',{induction_id:'I1',method:'cytotec',bishop_score:5,gestational_age_weeks:39,indication:'post_dates',hours_since_start:6}],
  ['o_fm','/api/ob_labor/fetal_monitoring',{session_id:'F1',fetal_heart_rate:140,variability:10,accelerations:2,decelerations:0,category:'category_1',interventions:false}],
  ['o_del','/api/ob_labor/delivery',{delivery_id:'D1',mode:'spontaneous_vaginal',blood_loss_ml:300,apgar_1min:8,apgar_5min:9,complications:false}],
  ['o_pp','/api/ob_labor/postpartum',{assessment_id:'PP1',hours_post_delivery:24,bp_systolic:130,bp_diastolic:85,fundal_height:0,lochia:1,postpartum_bleed:false,depression_screening:true}],

  ['o_con','/api/ob_gynecology/contraception',{patient_id:'P1',method:'iud_levonorgestrel',age:30,smoking:false,hypertension:false,migraine_with_aura:false,us_medical_eligibility:'mec_1'}],
  ['o_cs','/api/ob_gynecology/cervical_screening',{patient_id:'P1',age:35,test_type:'co_test',result:'normal',previous_result:'normal',years_since_last:3}],
  ['o_men','/api/ob_gynecology/menopause',{patient_id:'P1',age:52,amenorrhea_12mo:true,symptoms:'hot_flashes',ht_appropriate:true,contraindication:false}],
  ['o_ab','/api/ob_gynecology/abnormal_bleeding',{patient_id:'P1',pattern:'menorrhagia',hemoglobin:11,pregnancy_test:false,ultrasound_done:false,biopsy_indicated:false}],
  ['o_pcos','/api/ob_gynecology/pcos',{patient_id:'P1',rotterdam:'classic_pcos',irregular_cycles:true,hyperandrogenism_clinical:true,polycystic_ovaries_us:true,metabolic_syndrome:false}],

  ['o_apg','/api/ob_neonatal/apgar',{assessment_id:'N1',hr:2,respiratory_effort:2,muscle_tone:1,response_to_stimulation:1,skin_color:1}],
  ['o_nrp','/api/ob_neonatal/nrp',{event_id:'NRP1',heart_rate:120,term:true,tone:'good',cry:true,minutes_of_life:1,cpap_or_pp:false,intubation:false}],
  ['o_nbs','/api/ob_neonatal/newborn_screen',{newborn_id:'NB1',hours_of_life:36,hearing_screen_done:true,metabolic_screen_drawn:true,bilirubin_done:true,hep_b_vaccine_given:true,vitamin_k_given:true,erythromycin_given:true}],
  ['o_th','/api/ob_neonatal/thermoregulation',{assessment_id:'NT1',temp_c:36.8,hours_of_life:6,skin_to_skin:true,radiant_warmer:false,incubator:false}],
  ['o_feed','/api/ob_neonatal/feeding_newborn',{feeding_id:'NF1',hours_of_life:48,method:'breast',feeding_volume_ml:30,latch_established:true,supplementation_needed:false,weight_loss_pct:5}],

  ['o_inf','/api/ob_reproduction/infertility',{couple_id:'C1',months_trying:18,factor:'unexplained',workup_started:true,partner_evaluated:true,referral:'re'}],
  ['o_ivf','/api/ob_reproduction/ivf_cycle',{cycle_id:'IVF1',protocol:'antagonist',days_stimulation:10,peak_e2:2500,eggs_retrieved:12,eggs_fertilized:10,blastocysts:6}],
  ['o_et','/api/ob_reproduction/transfer',{transfer_id:'ET1',day:'day_5',endometrial_thickness_mm:9,embryos_transferred:1,single_embryo_transfer:true,quality:'euploid_high',beta_hcg_12d:200}],
  ['o_ov','/api/ob_reproduction/ovulation',{cycle_id:'OC1',method:'letrozole',cycle_day:14,dominant_follicle_mm:19,endometrial_thickness_mm:8,response:'adequate'}],
  ['o_mis','/api/ob_reproduction/miscarriage',{event_id:'M1',type:'complete',gestational_age_weeks:8,rh_status:true,rhogam_given:true,workup_started:false}],
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
fs.writeFileSync('sm_obstetrics_tier28.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);