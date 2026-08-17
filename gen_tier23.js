// filepath: gen_tier23.js
const fs = require('fs');

const routes = [
  [148, 'access', 'access_avf,access_avg,access_catheter,access_stenosis,access_cannulation'],
  [149, 'adequacy', 'ktv,urr,dry_weight,session_freq,clearance'],
  [150, 'complication', 'hypotension,arrhythmia,cramping,disequilibrium,air_embolism'],
  [151, 'peritoneal', 'pet_test,peritonitis,uf_capacity,pd_adequacy,catheter_pd'],
  [152, 'dialyzer', 'dialyzer_select,reuse,dialysate,anticoagulation,water_quality'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier23_dialysis_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier23_dialysis_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier23_dialysis_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['a_avf','/api/dialysis_access/access_avf',{avf_id:'AV1',location:'left_upper_arm',flow_ml_min:800,thrill_palpable:true,bruit_audible:true,assessment:'maturation_complete',arterial_diameter_mm:4,venous_diameter_mm:8}],
  ['a_avg','/api/dialysis_access/access_avg',{avg_id:'G1',location:'left_forearm',flow_ml_min:1200,thrill_palpable:true,bruit_audible:true,days_post_op:true,days_since_cannulation:60}],
  ['a_cat','/api/dialysis_access/access_catheter',{catheter_id:'C1',catheter_type:'tunneled_cuffed',days_since_insertion:30,exit_site_clean:true,fever_present:false,blood_flow_ml_min:350,crbsi_suspected:false}],
  ['a_ste','/api/dialysis_access/access_stenosis',{access_id:'AV1',psv_ratio:2.5,residual_diameter_pct:60,location:'venous_anastomosis',clinical_signs:true,recommendation:'angioplasty'}],
  ['a_can','/api/dialysis_access/access_cannulation',{cannulation_id:'CAN1',technique:'rope_ladder',arterial_site_rotated:true,venous_site_rotated:true,needle_gauge:16,aneurysm_present:false}],

  ['d_ktv','/api/dialysis_adequacy/ktv',{session_id:'S1',pre_bun:60,post_bun:20,dialyzer_clearance_ml_min:200,treatment_time_min:240,ultrafiltration_l:2.5,modality:'hemodialysis'}],
  ['d_urr','/api/dialysis_adequacy/urr',{session_id:'S1',pre_bun:60,post_bun:20,rebound_considered:true}],
  ['d_dw','/api/dialysis_adequacy/dry_weight',{patient_id:'P1',pre_weight_kg:80,post_weight_kg:78,target_weight_kg:78,ultrafiltration_l:2,cramping_reported:false,sbp_pre:140,sbp_post:120}],
  ['d_frq','/api/dialysis_adequacy/session_freq',{patient_id:'P1',sessions_per_week:3,modality:'conventional_3xw',weekly_ktv:3.6,residual_kidney_function_ml_min:3}],
  ['d_clr','/api/dialysis_adequacy/clearance',{session_id:'S1',urea_clearance_ml_min:220,treatment_time_min:240,ultrafiltration_l:2.5,dialyzer_type:'high_flux_synthetic',pre_weight_kg:80,qb_ml_min:350,qd_ml_min:600}],

  ['c_hyp','/api/dialysis_complication/hypotension',{episode_id:'E1',sbp_drop:30,sbp_nadir:95,symptoms_present:false,timing:'mid_session',uf_rate_ml_kg_h:10,intervention_required:false}],
  ['c_arr','/api/dialysis_complication/arrhythmia',{episode_id:'E2',arrhythmia_type:'afib_rvr',duration_sec:120,hemodynamic_compromise:false,potassium_pre:4.5,calcium_pre:2.4,electrolyte_review_needed:false}],
  ['c_cra','/api/dialysis_complication/cramping',{episode_id:'E3',location:'calf',severity:4,uf_volume_l:2.5,pre_weight_kg:80,responded_to_saline:true}],
  ['c_dsq','/api/dialysis_complication/disequilibrium',{episode_id:'E4',bnp_pre:200,first_dialysis:false,pre_urea:90,symptoms:'headache',urea_reduction_ratio_pct:65}],
  ['c_air','/api/dialysis_complication/air_embolism',{episode_id:'E5',air_volume_ml:5,cns_symptoms:false,cardiovascular_collapse:false,detection_time_sec:10,trendelenburg_positioned:true}],

  ['p_pet','/api/dialysis_peritoneal/pet_test',{patient_id:'P1',d_p_cr:0.65,d4_d0:0.7,transport_type:'low_average',ultrafiltration_4h_ml:300,dextrose_concentration:'2_5'}],
  ['p_prt','/api/dialysis_peritoneal/peritonitis',{episode_id:'PPE1',wbc_cells_mm3:1500,neutrophil_pct:75,cloudy_effluent:true,culture_positive:true,organism:'coag_neg_staph',days_since_start:2}],
  ['p_ufc','/api/dialysis_peritoneal/uf_capacity',{session_id:'PS1',fill_volume_l:2,drain_volume_l:2.7,dwell_time_h:4,dextrose:'2_5'}],
  ['p_adq','/api/dialysis_peritoneal/pd_adequacy',{patient_id:'P1',weekly_ktv:2.1,pet_crcl:65,modality:'capd',residual_kidney_function_ml_min:4}],
  ['p_cat','/api/dialysis_peritoneal/catheter_pd',{catheter_id:'PC1',type:'tenckhoff_double_cuffed',exit_site_clean:true,tunnel_clean:true,days_since_insertion:90,complication:'none'}],

  ['z_sel','/api/dialysis_dialyzer/dialyzer_select',{patient_id:'P1',weight_kg:80,modality:'hemodiafiltration',k_urea_target_ml_min:250,membrane:'high_flux_synthetic'}],
  ['z_reu','/api/dialysis_dialyzer/reuse',{dialyzer_id:'D1',reuse_count:5,tcv_pct:92,fiber_bundle_volume_adequate:true,reprocess_method:'automated_peracetic_acid',failure_detected:false}],
  ['z_dia','/api/dialysis_dialyzer/dialysate',{session_id:'S1',sodium_mmol_l:140,potassium_mmol_l:2.5,calcium_mmol_l:1.25,bicarbonate_mmol_l:35,dextrose_mg_dl:100,temperature:'36_5'}],
  ['z_ant','/api/dialysis_dialyzer/anticoagulation',{session_id:'S1',anticoagulant:'heparin_lmw',dose_units:5000,act_baseline:120,act_peak:200,bleeding_clotting_event:false,session_hours:4}],
  ['z_wat','/api/dialysis_dialyzer/water_quality',{station_id:'STA1',total_chlorine_ppm:0.05,aluminum_ug_l:5,bacteria_cfu_ml:50,endotoxin_eu_ml:0.1,ultrapure_status:true}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\dialysis_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_dialysis_tier23.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);