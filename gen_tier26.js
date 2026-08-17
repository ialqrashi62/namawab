// filepath: gen_tier26.js
const fs = require('fs');

const routes = [
  [163, 'tumor', 'tnm_stage,tumor_board,molecular,ecog,mdt_coordination'],
  [164, 'chemo', 'bsa,regimen,toxicity,premed,response'],
  [165, 'radiation', 'radiation_dose,organs_at_risk,simulation,brachy,followup_radiation'],
  [166, 'palliative', 'pain_assess,hospice,symptoms,goals_care,bereavement'],
  [167, 'survivor', 'surveillance,late_effects,survivorship_care,cardio_oncology,fertility'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier26_oncology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier26_oncology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier26_oncology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['o_tnm','/api/oncology_tumor/tnm_stage',{case_id:'C1',t:'t2',n:'n1',m:'m0',ajcc_stage:'iia',primary_site:'colon_caecum',histology:'adenocarcinoma'}],
  ['o_tb','/api/oncology_tumor/tumor_board',{meeting_id:'M1',case_id:'C1',presenter:'medical_oncology',decision:'chemoradiation',consensus:true,attendees:8}],
  ['o_mol','/api/oncology_tumor/molecular',{case_id:'C1',biomarker:'egfr',result:'mutated',actionable:true,targeted_therapy:'osimertinib',fish_confirmed:true}],
  ['o_eco','/api/oncology_tumor/ecog',{patient_id:'P1',ecog_score:'1',comorbidities:true,treatment_intent:'curative',weight_loss_pct_6m:5,functional_decline:false}],
  ['o_mdt','/api/oncology_tumor/mdt_coordination',{case_id:'C1',path_reviewed:true,imaging_reviewed:true,primary_specialty:'surgical',timeline:'within_4_weeks',care_plan_documented:true}],

  ['o_bsa','/api/oncology_chemo/bsa',{weight_kg:70,height_cm:170}],
  ['o_reg','/api/oncology_chemo/regimen',{patient_id:'P1',regimen:'folfox',cycle_number:3,dose_pct:100,line:'adjuvant',bone_marrow_recovered:true}],
  ['o_tox','/api/oncology_chemo/toxicity',{assessment_id:'A1',ctcae_grade:'2',toxicity_type:'neutropenia',hospitalization:false,dose_delay_required:false,days_since_last_cycle:14}],
  ['o_pre','/api/oncology_chemo/premed',{session_id:'S1',regimen:'r_chop',antiemetic_given:true,corticosteroid_given:true,granulocyte_given:'pegfilgrastim',allergy_prophylaxis:true}],
  ['o_res','/api/oncology_chemo/response',{assessment_id:'A2',recist:'pr_partial_response',cycle_count:4,method:'ct',tumor_burden_pct_change:false,new_lesions:false}],

  ['o_dose','/api/oncology_radiation/radiation_dose',{plan_id:'P1',modality:'imrt',total_dose_gy:60,fractions:30,dose_per_fraction_gy:2,target_volume:'prostate_ptv',image_guidance:true}],
  ['o_oar','/api/oncology_radiation/organs_at_risk',{plan_id:'P1',oar_name:'rectum',max_dose_gy:65,mean_dose_gy:35,volume_above_threshold_pct:25,constraint_met:'met',action_required:false}],
  ['o_sim','/api/oncology_radiation/simulation',{sim_id:'S1',position:'supine',immobilization:'vacuum_bag',ct_simulation:true,mri_simulation:false,four_d_ct_done:false,slice_thickness_mm:2}],
  ['o_brch','/api/oncology_radiation/brachy',{plan_id:'P2',brachy_type:'hdr',dose_gy:30,dose_rate_cgy_per_h:500,treatment_time_h:0.5,us_mri:true}],
  ['o_fu','/api/oncology_radiation/followup_radiation',{followup_id:'F1',days_post_rt:14,skin_toxicity:'grade_2',mucositis:'grade_1',dysphagia:'soft',pneumonitis_suspected:false}],

  ['o_pain','/api/oncology_palliative/pain_assess',{assessment_id:'PA1',pain_score:5,pain_type:'nociceptive_somatic',opioid_required:true,morphine_equivalent_daily:30,side_effects:'constipation'}],
  ['o_hos','/api/oncology_palliative/hospice',{patient_id:'P1',days_prognosis:60,eligible:true,disease_trajectory:'declining',consent:true,advanced_directive:true}],
  ['o_sym','/api/oncology_palliative/symptoms',{assessment_id:'PA2',symptom:'dyspnea',severity:6,distressing:true,treatment:'pharmacologic',family_aware:true}],
  ['o_gl','/api/oncology_palliative/goals_care',{discussion_id:'D1',code_status:'dnr',proxy_identified:true,goal:'comfort',discussion_documented:true,family_present:true}],
  ['o_brv','/api/oncology_palliative/bereavement',{family_id:'F1',days_since_death:7,bereavement_services_offered:true,loss_type:'expected',followup_call_done:false,referral_made:false}],

  ['o_sur','/api/oncology_survivor/surveillance',{patient_id:'P1',cancer_type:'breast',days_since_treatment:730,imaging_freq:'annually',tumor_markers:'none',recurrence_suspected:false}],
  ['o_le','/api/oncology_survivor/late_effects',{assessment_id:'LE1',years_since_treatment:3,late_effect:'cardiotoxicity',severity:'moderate',treatment_history:'chemotherapy',followup_specialty:true}],
  ['o_sc','/api/oncology_survivor/survivorship_care',{plan_id:'SC1',years_since_treatment:2,treatment_summary_completed:true,survivorship_care_plan:true,lifestyle:'active',psychological_support:true}],
  ['o_co','/api/oncology_survivor/cardio_oncology',{assessment_id:'CO1',anthracycline_exposure:'doxorubicin',cumulative_dose_mg_m2:240,lvef:55,heart_failure_stage:'a_at_risk',bnp_elevated:false}],
  ['o_ft','/api/oncology_survivor/fertility',{patient_id:'P1',gender:'female',fertility_status:'preservation_planned',sperm_bank_offered:false,egg_freeze_offered:true,reproductive_counseling:'done'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\onc_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_oncology_tier26.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);