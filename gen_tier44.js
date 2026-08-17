// filepath: gen_tier44.js
const fs = require('fs');

const routes = [
  [253, 'ped_resp', 'asthma,bronchiolitis,pneumonia,croup,foreign_body_aspiration'],
  [254, 'ped_neonat', 'premature_infant,respiratory_distress,neonatal_jaundice,sepsis_neonatal,feeding_problem'],
  [255, 'ped_gastro', 'gerd,constipation_ped,celiac_disease,failure_to_thrive,ibd_ped'],
  [256, 'ped_endo', 'type1_diabetes_ped,growth_hormone_deficiency,puberty_disorder,congenital_adrenal_hyp,thyroid_ped'],
  [257, 'ped_immuno', 'primary_immunodeficiency,kawasaki_disease,juvenile_arthritis_ped,vaccination_review,allergy_ped'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier44_pediatrics_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier44_pediatrics_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier44_pediatrics_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['k_ast','/api/ped_resp/asthma',{patient_id:'PED1',age_years:7,severity:'moderate',peak_flow_pct:70,oxygen_sat:93,trigger:'viral_uri',treatment:'systemic_steroid_albuterol_nebulizer'}],
  ['k_brn','/api/ped_resp/bronchiolitis',{patient_id:'PED2',age_months:4,risk:'rsv_season',respiratory_rate:55,oxygen_sat:91,wheezing:true,treatment:'supportive_oxygen_suctioning'}],
  ['k_pnm','/api/ped_resp/pneumonia',{patient_id:'PED3',age_years:3,oxygen_sat:92,infiltrate:'right_lower_lobe',pathogen:'mycoplasma_suspected',treatment:'azithromycin',complications:'none'}],
  ['k_crp','/api/ped_resp/croup',{patient_id:'PED4',age_years:2,severity:'moderate',stridor:'at_rest',barking_cough:true,treatment:'oral_dexamethasone_nebulized_epinephrine'}],
  ['k_fba','/api/ped_resp/foreign_body_aspiration',{patient_id:'PED5',age_years:18,location:'right_main_bronchus',symptoms:'persistent_wheeze_recurrent_pneumonia',management:'rigid_bronchoscopy_removal',complications:'none'}],

  ['k_pre','/api/ped_neonat/premature_infant',{patient_id:'NEO1',gestational_age_weeks:28,birth_weight_g:1100,apgar_5:6,surfactant_administered:true,ventilation:'cpap',nicu_days:60,status:'discharge_planning'}],
  ['k_rds','/api/ped_neonat/respiratory_distress',{patient_id:'NEO2',gestational_age_weeks:32,oxygen_sat:88,retractions:'severe',silverman_score:8,surfactant_given:true,ventilation:'mechanical',outcome:'improving'}],
  ['k_njl','/api/ped_neonat/neonatal_jaundice',{patient_id:'NEO3',age_hours:72,bilirubin_total:18,bilirubin_direct:1,phototherapy:'intensive',exchange_transfusion:false,risk:'isoimmune_ab_positive'}],
  ['k_nsp','/api/ped_neonat/sepsis_neonatal',{patient_id:'NEO4',age_days:5,temperature:38.9,wbc:24000,blood_culture:'pending',antibiotics:'ampicillin_gentamicin',supportive:'iv_fluids_oxygen'}],
  ['k_fed','/api/ped_neonat/feeding_problem',{patient_id:'NEO5',age_days:7,weight_loss_pct:9,feeding_method:'breast',latch_difficulty:true,intervention:'lactation_consultant_formula_supplement'}],

  ['k_grd','/api/ped_gastro/gerd',{patient_id:'PG1',age_months:4,symptoms:'frequent_spitting_vomiting',weight_gain:'inadequate',trial_therapy:'thickened_feeds',response:'partial',next_step:'prokinetic_consider'}],
  ['k_cst','/api/ped_gastro/constipation_ped',{patient_id:'PG2',age_years:5,frequency_per_week:1,soiling:true,abdominal_xray:'stool_loaded',treatment:'polyethylene_glycol_maintenance'}],
  ['k_clc','/api/ped_gastro/celiac_disease',{patient_id:'PG3',age_years:8,symptoms:'abdominal_pain_growth_delay',anti_ttg:'>10x',biopsy_confirmed:true,dietary_change:'gluten_free',follow_up:3}],
  ['k_ftt','/api/ped_gastro/failure_to_thrive',{patient_id:'PG4',age_months:11,weight_zscore:-3,caloric_intake:'inadequate',workup:'negative',intervention:'high_calorie_feeding_dietitian'}],
  ['k_ibd','/api/ped_gastro/ibd_ped',{patient_id:'PG5',age_years:14,type:'crohns',location:'ileocolonic',pcDAI:35,treatment:'exclusive_enteral_nutrition_immunosuppression',response:'improving'}],

  ['k_dm1','/api/ped_endo/type1_diabetes_ped',{patient_id:'PE1',age_years:9,hba1c:8.2,insulin_regimen:'basal_bolus',cgm:true,hypoglycemic_episodes_per_week:1,follow_up:3}],
  ['k_ghd','/api/ped_endo/growth_hormone_deficiency',{patient_id:'PE2',age_years:8,height_zscore:-2.8,gh_stimulation_peak:4,bone_age:'delayed',treatment:'recombinant_gh_started',response:'improving'}],
  ['k_pub','/api/ped_endo/puberty_disorder',{patient_id:'PE3',age_years:13,sex:'female',type:'precocious',bone_age:'advanced',lh_peak:5,intervention:'gnrh_agonist'}],
  ['k_cah','/api/ped_endo/congenital_adrenal_hyp',{patient_id:'PE4',age_days:14,form:'classic_salt_wasting',sodium:124,potassium:6.5,'17_ohp':20000,treatment:'hydrocortisone_fludrocortisone',status:'stable'}],
  ['k_thy','/api/ped_endo/thyroid_ped',{patient_id:'PE5',age_years:10,condition:'hypothyroidism_acquired',tsh:45,t4_free:0.7,etiology:'hashimotos',treatment:'levothyroxine',response:'normalizing'}],

  ['k_pid','/api/ped_immuno/primary_immunodeficiency',{patient_id:'PI1',age_years:4,type:'xlinked_agammaglobulinemia',igg:120,recurrent_infections:true,treatment:'ivig_replacement',response:'improving'}],
  ['k_kaw','/api/ped_immuno/kawasaki_disease',{patient_id:'PI2',age_years:2,fever_days:6,criteria_met:5,coronary_aneurysm:false,treatment:'ivig_aspirin',response:'good'}],
  ['k_jia','/api/ped_immuno/juvenile_arthritis_ped',{patient_id:'PI3',age_years:6,subtype:'polyarticular',joints_involved:5,jadas_score:18,treatment:'methotrexate_biologic',response:'improving'}],
  ['k_vac','/api/ped_immuno/vaccination_review',{patient_id:'PI4',age_years:2,schedule_up_to_date:false,missed_vaccines:['varicella','mmr','hepatitis_a'],plan:'catch_up_schedule'}],
  ['k_alg','/api/ped_immuno/allergy_ped',{patient_id:'PI5',age_years:5,type:'food_anaphylaxis',allergens:['peanut','tree_nut'],severity:'severe',treatment:'epiphen_avoidance_desensitization_consider'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\ped_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_ped_tier44.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);