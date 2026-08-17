// filepath: gen_tier33.js
const fs = require('fs');

const routes = [
  [198, 'diabetes', 'dm_diagnosis,hba1c_target,insulin_regimen,glucose_monitoring,dm_complications'],
  [199, 'thyroid', 'thyroid_function,thyroid_nodule,hyperthyroid,hypothyroid,thyroid_cancer'],
  [200, 'adrenal', 'adrenal_incidentaloma,cushing_syndrome,adrenal_insufficiency,primary_aldosteronism,pheochromocytoma'],
  [201, 'pituitary', 'pituitary_adenoma,prolactinoma,acromegaly,diabetes_insipidus,pituitary_apoplexy'],
  [202, 'metabolic', 'obesity_management,lipid_management,osteoporosis,pcos,gender_dysphoria'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier33_endocrinology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier33_endocrinology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier33_endocrinology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['e_dd','/api/endo_diabetes/dm_diagnosis',{patient_id:'D1',fpg_mg_dl:126,hba1c_pct:6.8,ogtt_2h_mg_dl:200,dm_type:'t2dm',bmi:32}],
  ['e_ht','/api/endo_diabetes/hba1c_target',{patient_id:'D2',age:55,comorbidities:'none',hba1c_current:8.5,target_hba1c:7.0,treatment_intensity:'intensify'}],
  ['e_ir','/api/endo_diabetes/insulin_regimen',{patient_id:'D3',regimen:'basal_bolus',total_daily_dose:50,basal_pct:50,fasting_glucose:130,glucose_variability:'high'}],
  ['e_gm','/api/endo_diabetes/glucose_monitoring',{patient_id:'D4',monitoring_type:'cgm',time_in_range_pct:65,time_below_range_pct:3,time_above_range_pct:32,gmi_pct:7.2}],
  ['e_dm','/api/endo_diabetes/dm_complications',{patient_id:'D5',retinopathy:'none',nephropathy:'microalbuminuria',neuropathy:'peripheral',cardiovascular:'cad',foot_exam:'normal'}],

  ['e_tf','/api/endo_thyroid/thyroid_function',{patient_id:'T1',tsh:0.05,free_t4:2.5,free_t3:5.0,pattern:'overt_hyperthyroidism',antibody_tpo:'positive'}],
  ['e_tn','/api/endo_thyroid/thyroid_nodule',{patient_id:'T2',nodule_size_cm:1.2,tirads:'tr3',tsh:1.5,biopsy_indicated:true,biopsy_result:'benign'}],
  ['e_hy','/api/endo_thyroid/hyperthyroid',{patient_id:'T3',etiology:'graves',tsh:0.01,t4:14,treatment:'methimazole',response:'improving',duration_months:6}],
  ['e_ho','/api/endo_thyroid/hypothyroid',{patient_id:'T4',tsh:8.5,free_t4:0.7,etiology:'hashimoto',levothyroxine_dose:75,adherence:'good',recheck_6_weeks:true}],
  ['e_tc','/api/endo_thyroid/thyroid_cancer',{patient_id:'T5',cancer_type:'papillary',stage:'t1n0m0',surgery_done:true,rai_needed:false,thyroglobulin:1.5,monitoring:'annual'}],

  ['e_ai','/api/endo_adrenal/adrenal_incidentaloma',{patient_id:'A1',lesion_size_cm:2.5,hounsfield_units:5,hormonal_workup_done:true,functional:'non_functional',follow_up_6_months:true}],
  ['e_cu','/api/endo_adrenal/cushing_syndrome',{patient_id:'A2',late_night_salivary_cortisol:6,dex_suppression_1mg:'positive',acth:8,imaging_done:true,cause:'pituitary'}],
  ['e_insuf','/api/endo_adrenal/adrenal_insufficiency',{patient_id:'A3',cortisol_am:3,acth:80,synacthen_stim:'failed',etiology:'primary',hydrocort_dose:20}],
  ['e_pa','/api/endo_adrenal/primary_aldosteronism',{patient_id:'A4',aldosterone_renin_ratio:80,aldosterone:25,renin:0.3,confirmatory_test:'positive',subtype_workup:'ct_ordered'}],
  ['e_ph','/api/endo_adrenal/pheochromocytoma',{patient_id:'A5',plasma_metanephrine:300,urine_metanephrine:800,imaging_done:true,tumor_size_cm:3.5,alpha_blockade:true}],

  ['e_pa2','/api/endo_pituitary/pituitary_adenoma',{patient_id:'P1',tumor_size_mm:8,functional:false,hormonal_workup:'non_functional',vision_defect:false,follow_up:'6_months'}],
  ['e_prl','/api/endo_pituitary/prolactinoma',{patient_id:'P2',prolactin:200,tumor_size_mm:5,dopamine_agonist:'cabergoline',response:'normalized',side_effects:'none'}],
  ['e_ac','/api/endo_pituitary/acromegaly',{patient_id:'P3',igf1:550,gh_after_ogtt:2.5,tumor_size_mm:12,treatment:'transsphenoidal_surgery',response:'biochemical_control'}],
  ['e_di','/api/endo_pituitary/diabetes_insipidus',{patient_id:'P4',urine_output_ml_day:5000,sodium:148,plasma_osmolality:295,water_deprivation_test:'positive',desmopressin_response:true}],
  ['e_ap','/api/endo_pituitary/pituitary_apoplexy',{patient_id:'P5',presentation:'acute_headache_visual_loss',hormonal_deficit:'panhypopituitarism',imaging:'hemorrhage',treatment:'emergency_surgery'}],

  ['e_ob','/api/endo_metabolic/obesity_management',{patient_id:'M1',bmi:38,waist_cm:120,comorbidities:'t2dm_htn',previous_attempts:3,glp1_agonist:true,bariatric_referred:true}],
  ['e_lp','/api/endo_metabolic/lipid_management',{patient_id:'M2',ldl:160,hdl:35,triglycerides:250,statin_intensity:'high_intensity',cv_risk:'high',pcsk9_consider:true}],
  ['e_os','/api/endo_metabolic/osteoporosis',{patient_id:'M3',t_score:-2.8,fracture_history:'none',vitamin_d:25,calcium_intake:800,bisphosphonate_started:true}],
  ['e_pc','/api/endo_metabolic/pcos',{patient_id:'M4',oligomenorrhea:true,hyperandrogenism:true,polycystic_ovaries:true,metformin_started:true,fertility_desire:false}],
  ['e_gd','/api/endo_metabolic/gender_dysphoria',{patient_id:'M5',assigned_sex:'female',identified_gender:'male',hrt_started:true,psych_clearance:true,follow_up_3_months:true}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\endo_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_endo_tier33.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);