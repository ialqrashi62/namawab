// filepath: gen_tier22.js
const fs = require('fs');

const routes = [
  [143, 'assessment', 'wound_assess_type,wound_pain,wound_vascular,wound_infection,wound_nutritional'],
  [144, 'dressing', 'dressing_select,dressing_change,dressing_npwt,dressing_compression,dressing_assess'],
  [145, 'healing', 'wound_healing_trajectory,wound_healing_target,wound_healing_failure,wound_recurrence,wound_lifestyle'],
  [146, 'measurement', 'wound_measure,wound_area_change,wound_tunnel,wound_granulation,wound_exudate'],
  [147, 'staging', 'wound_pressure_stage,wound_wagner,wound_texas,wound_burn,wound_surgical'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier22_wound_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier22_wound_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier22_wound_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['w_at','/api/wound_assessment/wound_assess_type',{wound_id:'W1',patient_id:'P1',etiology:'pressure_injury',location:'sacrum',reassessment_documented:true,days_since_onset:7}],
  ['w_pain','/api/wound_assessment/wound_pain',{wound_id:'W1',pain_score:4,pain_type:'nociceptive',pain_assessed_dressing_change:true,premedication_given:false,pain_plan:'prn_oral'}],
  ['w_vasc','/api/wound_assessment/wound_vascular',{patient_id:'P1',abi:1.0,arterial_assessment:'normal',dorsalis_pedis_palpable:true,posterior_tibial_palpable:true,venous_assessment:'normal'}],
  ['w_inf','/api/wound_assessment/wound_infection',{wound_id:'W1',local_infection_signs:false,systemic_infection_signs:false,biofilm_suspected:false,culture_taken:false,culture_result:'not_collected'}],
  ['w_nutr','/api/wound_assessment/wound_nutritional',{patient_id:'P1',albumin:3.5,prealbumin:18,bmi:24,nutritional_status:'well_nourished',protein_intake_g_per_kg:1.2}],

  ['d_sel','/api/wound_dressing/dressing_select',{wound_id:'W1',dressing_type:'foam',exudate_amount:'moderate',controlled_donation:false,cavity_wound:false,infection_present:false}],
  ['d_chg','/api/wound_dressing/dressing_change',{wound_id:'W1',days_since_change:3,change_frequency_target_days:3,dressing_intact:true,saturated:false,leaking:false,removed_early:false}],
  ['d_npwt','/api/wound_dressing/dressing_npwt',{npwt_id:'NP1',pressure_mmhg:125,pressure_mode:'continuous',hours_since_change:48,seal_intact:true,fluid_collection_ml:250,wound_class:'stage_4'}],
  ['d_comp','/api/wound_dressing/dressing_compression',{wound_id:'W1',compression_mmhg:30,wrap_type:'short_stretch',arterial_supply_confirmed:true,dressing_intact:true,days_until_next_change:3}],
  ['d_ass','/api/wound_dressing/dressing_assess',{wound_id:'W1',periwound_skin_intact:true,maceration_present:false,tape_blister:false,allergies_documented:true,dressing_product_match:true}],

  ['h_trj','/api/wound_healing/wound_healing_trajectory',{wound_id:'W1',days_since_onset:21,healing_pct:45,area_initial:10,area_current:5.5,trending_healing:true,trajectory_status:'on_track'}],
  ['h_tgt','/api/wound_healing/wound_healing_target',{wound_id:'W1',target_days_to_heal:60,current_days:21,healing_pct:45,target_heal_pct_30d:40,on_track_30d:true,reassessment_at_30d_documented:true}],
  ['h_fail','/api/wound_healing/wound_healing_failure',{wound_id:'W1',pressure_offloaded:true,diabetes_controlled:true,smoking_cessation:true,infection_treated:true,medications_reviewed:true,advanced_therapy_considered:false}],
  ['h_rec','/api/wound_healing/wound_recurrence',{wound_id:'W1',recurrence:false,days_since_healed:90,location:'sacrum',preventive_measures:true,pressure_offloaded:true}],
  ['h_life','/api/wound_healing/wound_lifestyle',{patient_id:'P1',smoking:false,smoking_cessation_offered:false,nutrition_adequate:true,mobility:true,mobility_adequate:true,pressure_offloading_capability:true}],

  ['m_mea','/api/wound_measurement/wound_measure',{measurement_id:'M1',wound_id:'W1',length_cm:5,width_cm:3,depth_cm:1,head_to_head_method:true,photo_documented:true,measurement_position:'supine'}],
  ['m_chg','/api/wound_measurement/wound_area_change',{wound_id:'W1',area_current:15,area_previous:25,days_between:14,trend:'healing',healing_pct:40}],
  ['m_tun','/api/wound_measurement/wound_tunnel',{wound_id:'W1',tunnel_count:0,tunnel_max_depth_cm:0,undermining_pct:0,direction:'none',explored_with_cotton:true}],
  ['m_gran','/api/wound_measurement/wound_granulation',{wound_id:'W1',granulation_pct:'75_to_100',epithelialization_pct:'50_to_74',healthy_red_beefy:true,fragile_bleeds_easily:false}],
  ['m_exu','/api/wound_measurement/wound_exudate',{wound_id:'W1',exudate_amount:'small',exudate_type:'serous',odor_present:false,dressing_saturated:false,dressing_change_frequency_h:48}],

  ['s_pst','/api/wound_staging/wound_pressure_stage',{wound_id:'W1',npuap_stage:'stage_2',non_blanchable_erythema:true,partial_thickness_skin_loss:true,full_thickness_skin_loss:false,tissue_exposed:false,slough_present:false,eschar_present:false}],
  ['s_wag','/api/wound_staging/wound_wagner',{wound_id:'W1',wagner_grade:'grade_2_deep_to_tendon',tendon_exposed:true,bone_exposed:false,abscess_present:false,osteomyelitis:false}],
  ['s_tex','/api/wound_staging/wound_texas',{wound_id:'W1',texas_grade:'grade_2_to_tendon_capsule_bone',texas_stage:'stage_a_clean',infection_present:false,ischemia_present:false,depth_cm:1.5}],
  ['s_bur','/api/wound_staging/wound_burn',{burn_id:'B1',patient_id:'P1',etiology:'scald',burn_depth:'second_partial_superficial',tbsa_pct:5,airway_involvement:false,inhalation_injury:false,circumferential:false}],
  ['s_sur','/api/wound_staging/wound_surgical',{wound_id:'W1',patient_id:'P1',wound_class:'clean',healing_phase:'proliferative',fascia_closed:true,skin_closed:true,days_post_op:7}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\wound_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_wound_tier22.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);