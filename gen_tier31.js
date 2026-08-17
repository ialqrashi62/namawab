// filepath: gen_tier31.js
const fs = require('fs');

const routes = [
  [188, 'ckd', 'ckd_stage,proteinuria,anemia_ckd,mineral_bone,ckd_progression'],
  [189, 'dialysis_access', 'av_fistula,av_graft,tunneled_catheter,peritoneal_access,access_monitoring'],
  [190, 'transplant_immuno', 'crossmatch_transplant,donor_specific_ab,immunosuppression,rejection_surveillance,graft_loss'],
  [191, 'nephro_ext', 'glomerulonephritis,polycystic_kidney,electrolyte_acid_base,stone_clinic,hypertensive_renal'],
  [192, 'renal_nutrition', 'renal_dietitian,potassium_management,phosphorus_binding,dialysis_diet_adequacy,fluid_management'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier31_nephrology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier31_nephrology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier31_nephrology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['n_cs','/api/nephro_ckd/ckd_stage',{patient_id:'P1',egfr:35,acr:120,ckd_cause:'diabetic',kidney_stones:false,fhx_polycystic:false}],
  ['n_pro','/api/nephro_ckd/proteinuria',{patient_id:'P2',upcr:1500,albumin_mg:600,proteinuria_grade:'a3',gfr_category:'g3a',monitoring:'3_month'}],
  ['n_an','/api/nephro_ckd/anemia_ckd',{patient_id:'P3',hgb:9.5,tsat:22,ferritin:250,esa_use:true,target_hgb:11}],
  ['n_mbd','/api/nephro_ckd/mineral_bone',{patient_id:'P4',calcium:8.8,phosphorus:5.2,pth:280,vitamin_d:25,bone_density:'osteopenia'}],
  ['n_prog','/api/nephro_ckd/ckd_progression',{patient_id:'P5',egfr_baseline:45,egfr_current:30,slope:-2.5,follow_up_years:3,progression_risk:'moderate'}],

  ['n_af','/api/nephro_da/av_fistula',{access_id:'A1',side:'left_arm',type:'radiocephalic',maturity_weeks:8,flow_ml_min:650,diameter_mm:6,complication:'none'}],
  ['n_graft','/api/nephro_da/av_graft',{access_id:'A2',type:'ptfe_loop',location:'forearm',flow_ml_min:1200,complication:'stenosis',intervention:'angioplasty'}],
  ['n_tc','/api/nephro_da/tunneled_catheter',{catheter_id:'C1',site:'right_ij',insertion_date:'2024-01-15',days_in_place:60,catheter_dysfunction:false,infection_signs:false}],
  ['n_pd','/api/nephro_da/peritoneal_access',{access_id:'PD1',catheter_type:'tenckhoff',insertion_technique:'laparoscopic',break_in_period_weeks:2,complication:'none'}],
  ['n_mon','/api/nephro_da/access_monitoring',{access_id:'M1',q_a_monitoring:'monthly',flow_ml_min:700,stenosis_signs:false,infection_signs:false,sound_normal:true}],

  ['n_xm','/api/nephro_immuno/crossmatch_transplant',{patient_id:'X1',donor_id:'D1',crossmatch:'negative',virtual_crossmatch:'negative',flow:'negative',cdc:'negative'}],
  ['n_dsa','/api/nephro_immuno/donor_specific_ab',{patient_id:'X2',dsa_present:true,mfi:2500,antibody_class:'class_ii',monitoring:'monthly',treatment:'rituximab_review'}],
  ['n_imm','/api/nephro_immuno/immunosuppression',{patient_id:'X3',regimen:'tacrolimus_mmf_prednisone',tacrolimus_trough:8,mmf_dose:1000,pred_dose:5,adherence:'good'}],
  ['n_rej','/api/nephro_immuno/rejection_surveillance',{patient_id:'X4',creatinine_baseline:1.5,creatinine_current:2.0,biopsy_indicated:true,biopsy_result:'acute_t_cell_mediated_grade_1b',treatment:'thymoglobulin'}],
  ['n_gl','/api/nephro_immuno/graft_loss',{patient_id:'X5',graft_function:'declining',egfr_current:18,return_dialysis:true,cause:'rejection_chronic',time_to_loss_years:8}],

  ['n_gn','/api/nephro_ext/glomerulonephritis',{patient_id:'G1',gn_type:'iga_nephropathy',proteinuria_g:2.5,creatinine:1.8,biopsy_done:true,raas_blockade:true,steroid_indicated:true}],
  ['n_pk','/api/nephro_ext/polycystic_kidney',{patient_id:'PK1',kidney_count:2,kidney_size_cm:18,fhx_polycystic:true,cyst_infection:false,tolvaptan_prescribed:false}],
  ['n_eab','/api/nephro_ext/electrolyte_acid_base',{patient_id:'E1',sodium:135,potassium:5.8,bicarbonate:14,anion_gap:12,egfr:25,acute:false}],
  ['n_st','/api/nephro_ext/stone_clinic',{patient_id:'S1',stone_type:'calcium_oxalate',recurrence:'yes',urine_24:'hypercalciuria',hydration_adequate:false,thiazide_prescribed:false}],
  ['n_ht','/api/nephro_ext/hypertensive_renal',{patient_id:'H1',bp_systolic:148,bp_diastolic:92,egfr:55,proteinuria_mg:300,raas_blockade:'ace_inhibitor',secondary_cause_screened:false}],

  ['n_rd','/api/nephro_nutrition/renal_dietitian',{patient_id:'R1',egfr:25,diet_referral:true,protein_g_per_kg:0.8,sodium_g:2,potassium_mg:2000,phosphorus_mg:800}],
  ['n_k','/api/nephro_nutrition/potassium_management',{patient_id:'R2',potassium:5.5,egfr:28,dietary_k_reviewed:true,patiromer_started:false,emergency_dialysis:false}],
  ['n_p','/api/nephro_nutrition/phosphorus_binding',{patient_id:'R3',phosphorus:6.5,calcium:9.2,binder_type:'calcium_acetate',pill_count:3,phosphate_target_5_5:false}],
  ['n_adeq','/api/nephro_nutrition/dialysis_diet_adequacy',{patient_id:'R4',kt_v:1.4,albumin:3.5,dietary_protein_intake:1.1,fluid_intake_ml:1200,dietitian_visit_monthly:true}],
  ['n_fm','/api/nephro_nutrition/fluid_management',{patient_id:'R5',fluid_removal_target:2.5,dry_weight:70,current_weight:73,interdialytic_weight_gain:3,bp_pre:160,fluid_adherence:'poor'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\nephro_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_nephro_tier31.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);