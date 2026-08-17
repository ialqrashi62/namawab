// filepath: gen_tier54.js
const fs = require('fs');

const routes = [
  [303, 'er_trauma', 'polytrauma,burn_thermal,trauma_amputation,blast_injury,penetrating_trauma'],
  [304, 'er_cardio', 'acs_emergent,arrhythmia_emergent,aortic_dissection,pericarditis_tamponade,pe_massive'],
  [305, 'er_neuro', 'stroke_alert,status_epilepticus_emergent,tbi_emergent,anion_gap_acidosis,meningitis_emergent'],
  [306, 'er_resp', 'respiratory_failure_emergent,asthma_exacerbation_severe,pneumothorax_tension,pulmonary_embola_massive,hemoptysis_massive'],
  [307, 'er_gi_gi', 'gi_bleed_upper,gi_bleed_lower,bowel_obstruction,perforation_gi,acute_pancreatitis_severe'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier54_emergency_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier54_emergency_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier54_emergency_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['e_pol','/api/er_trauma/polytrauma',{patient_id:'E1',iss:32,mechanism:'mvc_ejection',airway:'intubated',breathing:'left_chest_tube',circulation:'massive_transfusion','disability':'gcs_8','exposure':'log_roll_complete'}],
  ['e_brn','/api/er_trauma/burn_thermal',{patient_id:'E2',tbsa_pct:35,depth:'mixed_2nd_3rd',inhalation_injury:true,'fluid_resuscitation':'parkland_4ml_kg_tbsa','airway':'intubated','referral':'burn_center'}],
  ['e_amp','/api/er_trauma/trauma_amputation',{patient_id:'E3',type:'partial_left_hand',mechanism:'industrial_accident',ischemia_time_min:120,'reimplantation_candidate':'questionable','surgery':'irrigation_dressing_antibiotics'}],
  ['e_bla','/api/er_trauma/blast_injury',{patient_id:'E4','mechanism':'ied_blast','injuries':'shrapnel_burn_blast_lung',primary_survey:'airway_intubated','secondary_survey':'ct_chest_abdomen',hearing_loss:true}],
  ['e_pen','/api/er_trauma/penetrating_trauma',{patient_id:'E5','site':'chest_left','injury_type':'gsw','hemodynamic':'unstable','intervention':'edt_emergent_thoracotomy','findings':'cardiac_tamponade_released'}],

  ['e_acs','/api/er_cardio/acs_emergent',{patient_id:'EC1','presentation':'stemi_anterior','door_to_balloon_min':55,'culprit':'lad','ef_percent_post':50,'outcome':'successful_pci','arrhythmia_complication':'none'}],
  ['e_arr','/api/er_cardio/arrhythmia_emergent',{patient_id:'EC2','rhythm':'vt_unstable','rate':200,'hemodynamic':'unstable','intervention':'synchronized_cardioversion','success':true,'follow_up':'icd_evaluation'}],
  ['e_aoa','/api/er_cardio/aortic_dissection',{patient_id:'EC3','type':'stanford_b','site':'ascending_aorta','ct_angio':'positive','surgery':'emergent_repair','complications':'none','mortality_risk':'high'}],
  ['e_per','/api/er_cardio/pericarditis_tamponade',{patient_id:'EC4','etiology':'malignant','pericardiocentesis':'emergent','fluid_volume_ml':450,'hemodynamics_restored':true,'follow_up':'pericardial_window_planned'}],
  ['e_pe','/api/er_cardio/pe_massive',{patient_id:'EC5','risk_class':'massive','thrombolysis':'given','surgical_embolectomy':'considered_but_medically_managed','icu_admission':true,'outcome':'surviving'}],

  ['e_str','/api/er_neuro/stroke_alert',{patient_id:'EN1','type':'ischemic_left_mca','nihss':18,'door_to_ct_min':25,'door_to_needle_min':45,'intervention':'tpa_given','complications':'none'}],
  ['e_se','/api/er_neuro/status_epilepticus_emergent',{patient_id:'EN2','type':'convulsive','duration_min':35,'first_line':'benzodiazepine_im','second_line':'levetiracetam','intubation_required':true,'response':'controlled'}],
  ['e_tbi','/api/er_neuro/tbi_emergent',{patient_id:'EN3','gcs':6,'mechanism':'fall','ct_head':'subdural_hematoma','intervention':'neurosurgery_craniectomy','intubated':true,'monitoring':'icu'}],
  ['e_aga','/api/er_neuro/anion_gap_acidosis',{patient_id:'EN4','ph':7.15,'hco3':10,'anion_gap':24,'lactate':8,'etiology':'septic_lactic','treatment':'bicarbonate_icu','response':'correcting'}],
  ['e_men','/api/er_neuro/meningitis_emergent',{patient_id:'EN5','presentation':'classic_triad_fever_neck_stiffness_altered','lp_planned':'after_ct','antibiotics_empiric':'ceftriaxone_vanco_dexamethasone','lactic_acid':4.2,'response':'improving_24_hours'}],

  ['e_arf','/api/er_resp/respiratory_failure_emergent',{patient_id:'ER1','type':'hypercapnic','ph':7.18,'pco2':75,'oxygen_sat':85,'intervention':'bipap','success':false,'intubation':'performed','cause':'copd_exacerbation'}],
  ['e_asx','/api/er_resp/asthma_exacerbation_severe',{patient_id:'ER2',peak_flow_pct:40,oxygen_sat:90,silent_chest:true,treatment:'continuous_nebulized_albuterol_mg_so4_iv_steroid',response:'improving'}],
  ['e_ten','/api/er_resp/pneumothorax_tension',{patient_id:'ER3','side':'left','clinical_signs':'tracheal_deviation_jvd_hypotension','intervention':'needle_decompression_chest_tube','response':'hemodynamics_stabilized'}],
  ['e_pem','/api/er_resp/pulmonary_embola_massive',{patient_id:'ER4','echocardiogram':'rv_dilation','troponin':0.8,'bnp':620,'intervention':'systemic_thrombolysis_alteplase','response':'hemodynamics_improving'}],
  ['e_hem','/api/er_resp/hemoptysis_massive',{patient_id:'ER5','volume_ml':400,'source':'right_lower_lobe','airway_management':'selective_intubation_left','intervention':'bronchial_artery_angioembolization','status':'stabilized'}],

  ['e_ubt','/api/er_gi_gi/gi_bleed_upper',{patient_id:'EG1','source':'duodenal_ulcer','volume':'massive_actively_bleeding','initial_hgb':6.5,'transfusion':'prbc_4_units','intervention':'emergent_egd_clipping','outcome':'hemostasis_achieved'}],
  ['e_lbt','/api/er_gi_gi/gi_bleed_lower',{patient_id:'EG2','source':'diverticular','volume':'moderate','initial_hgb':8.2,'transfusion':'prbc_2_units','intervention':'colonoscopy_clipping','outcome':'hemostasis_achieved'}],
  ['e_bow','/api/er_gi_gi/bowel_obstruction',{patient_id:'EG3','site':'small_bowel','etiology':'adhesions','ct':'transition_point','management':'ng_tube_iv_fluids_surgical_consult','outcome':'observation_vs_surgery'}],
  ['e_prf','/api/er_gi_gi/perforation_gi',{patient_id:'EG4','site':'sigmoid','etiology':'diverticulitis','free_air':'pneumoperitoneum','intervention':'emergent_laparotomy_hartmann','antibiotics':'broad_spectrum','outcome':'stable_postop'}],
  ['e_pan','/api/er_gi_gi/acute_pancreatitis_severe',{patient_id:'EG5','etiology':'gallstone','apache_ii':18,'ct':'severe_balthazar_d','fluid_resuscitation':'aggressive_iv','icu_admission':true,'organ_failure':'transient_renal'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\er_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_er_tier54.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);