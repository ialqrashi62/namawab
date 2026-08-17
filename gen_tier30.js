// filepath: gen_tier30.js
const fs = require('fs');

const routes = [
  [183, 'transfusion', 'blood_type_screen,crossmatch,prbc_transfusion,platelet_transfusion,plasma_transfusion'],
  [184, 'apheresis', 'plasmapheresis,plateletpheresis,rbc_exchange,leukapheresis,lipid_apheresis'],
  [185, 'stem_cell', 'mobilization,collection,processing,cryopreservation,engraftment'],
  [186, 'cell_therapy', 'car_t_recovery,til_therapy,nk_cell,regenerative_injection,autologous_therapy'],
  [187, 'coag_ext', 'factor_replacement,inh_concentrate,antithrombin,protein_c_pathway,dic_management'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier30_hematology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier30_hematology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier30_hematology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['h_bts','/api/hem_transfusion/blood_type_screen',{patient_id:'P1',abo:'A',rh:'positive',antibody_screen:'negative',previous_transfusion:false}],
  ['h_cm','/api/hem_transfusion/crossmatch',{sample_id:'S1',recipient_abo:'A',recipient_rh:'positive',donor_abo:'A',donor_rh:'positive',crossmatch:'compatible',antibody_identified:'none'}],
  ['h_prbc','/api/hem_transfusion/prbc_transfusion',{transfusion_id:'T1',unit_number:'U1',blood_group:'A_positive',volume_ml:280,hgb_pre:6.5,symr_reaction:false,pre_meds:false}],
  ['h_plt','/api/hem_transfusion/platelet_transfusion',{transfusion_id:'T2',unit_type:'apheresis',platelet_count:300,plt_pre:8,plt_post:35,reaction:false,indications:'prophylactic'}],
  ['h_pls','/api/hem_transfusion/plasma_transfusion',{transfusion_id:'T3',plasma_type:'ffp',volume_ml:250,inr_pre:2.5,inr_post:1.4,reaction:false,indications:'warfarin_reversal'}],

  ['h_plm','/api/hem_apheresis/plasmapheresis',{session_id:'PL1',procedure:'plasmapheresis',volume_exchanged_ml:3000,replacement:'albumin',calcium_replacement:false,symptoms:'none'}],
  ['h_ptp','/api/hem_apheresis/plateletpheresis',{session_id:'PL2',procedure:'plateletpheresis',yield:4.5,target_yield:5.0,product_count:1,citrate_reaction:false}],
  ['h_rbcx','/api/hem_apheresis/rbc_exchange',{session_id:'RX1',patient_hgb:7,target_hgb:10,volume_exchanged:4500,end_hct:30,complication:false}],
  ['h_lkp','/api/hem_apheresis/leukapheresis',{session_id:'LK1',wbc_pre:120,target_wbc:50,product_volume:200,citrate_reaction:false,procedure_complete:true}],
  ['h_lip','/api/hem_apheresis/lipid_apheresis',{session_id:'LA1',ldl_pre:280,ldl_post:80,lpa_pre:120,symptoms:'none',duration_min:180}],

  ['h_mob','/api/hem_stem_cell/mobilization',{patient_id:'P1',regimen:'plerixafor_only',cd34_target:5,cd34_collected:6,collection_day:1,chemo_mobilization:false}],
  ['h_col','/api/hem_stem_cell/collection',{session_id:'SC1',cd34_count:6,product_volume:150,viability_pct:90,target_yield:5,collected_yield:6}],
  ['h_prc','/api/hem_stem_cell/processing',{product_id:'P1',processing_method:'volume_reduction',cd34_count:6,cell_viability_pct:90,red_cell_depletion:false,plasma_reduction:false}],
  ['h_cry','/api/hem_stem_cell/cryopreservation',{product_id:'P2',cryoprotectant:'dmso_10',freeze_method:'controlled_rate',storage_temp:-180,cell_viability_post:85,thaw_recovery_pct:80}],
  ['h_eng','/api/hem_stem_cell/engraftment',{patient_id:'P2',transplant_id:'TX1',neutrophil_engraftment_day:11,platelet_engraftment_day:14,chimerism_pct:95,gvhd_grade:'none'}],

  ['h_car','/api/hem_cell_therapy/car_t_recovery',{patient_id:'P3',cell_product:'tisagenlecleucel',infusion_day:0,cytokine_release_syndrome_grade:1,icans_grade:0,response:'partial',monitoring_days:30}],
  ['h_til','/api/hem_cell_therapy/til_therapy',{session_id:'CT1',tumor_type:'melanoma',infusion_cells:50,response:'stable',complication:'none',response_assessment_day:30}],
  ['h_nk','/api/hem_cell_therapy/nk_cell',{session_id:'NK1',cell_dose:50,donor_source:'haploidentical',response:'complete',complication:'none',follow_up_day:30}],
['h_reg','/api/hem_cell_therapy/regenerative_injection',{session_id:'RG1',tissue_target:'joint',cell_type:'prp',platelet_concentration:5,volume_ml:5,response:'improved'}],
['h_aut','/api/hem_cell_therapy/autologous_therapy',{session_id:'AT1',cell_product:'autologous_culture',cell_viability:90,response:'stable',follow_up_day:90}],

['h_fac','/api/hem_coag_ext/factor_replacement',{patient_id:'P4',factor:'factor_viii',baseline_pct:2,post_pct:80,dosing_units:3000,half_life_h:12,indication:'prophylactic'}],
  ['h_inh','/api/hem_coag_ext/inh_concentrate',{episode_id:'IN1',inhibitor_titer:5,product:'bypassing_agent',response:'partial',bleeding_controlled:true,complication:false}],
  ['h_at','/api/hem_coag_ext/antithrombin',{patient_id:'P5',baseline_at_pct:40,target_pct:80,dose_units:1500,post_at_pct:85,indication:'heparin_resistance'}],
  ['h_pc','/api/hem_coag_ext/protein_c_pathway',{patient_id:'P6',protein_c_pct:30,protein_s_pct:35,thrombosis_history:true,replacement:'protein_c_concentrate',post_pc_pct:75}],
  ['h_dic','/api/hem_coag_ext/dic_management',{episode_id:'DC1',istg_score:5,plt_count:35,pt:18,fibrinogen:1.2,ddimer:8,treatment:'plasma_platelet'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\hematology_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_hematology_tier30.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);