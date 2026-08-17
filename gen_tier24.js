// filepath: gen_tier24.js
const fs = require('fs');

const routes = [
  [153, 'candidate', 'candidate_eligibility,candidate_workup,crossmatch,pra,waiting_list'],
  [154, 'donor', 'donor_type,donor_screening,allocation,preservation,procurement'],
  [155, 'immuno', 'induction,maintenance,rejection,drug_level,prophylaxis'],
  [156, 'outcome', 'graft_function,infection_post,malignancy_post,cv_complication,renal_function'],
  [157, 'followup', 'surveillance,return_to_or,retransplant,life_quality,transition_care'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier24_transplant_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier24_transplant_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier24_transplant_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['c_elg','/api/tx_candidate/candidate_eligibility',{candidate_id:'C1',organ:'kidney',age:45,malignancy_history:false,active_infection:false,substance_use:false,bmi:28,compliance_history:true,blood_type:'A'}],
  ['c_wu','/api/tx_candidate/candidate_workup',{candidate_id:'C1',echo_done:true,lvef:55,pulmonary_tests_done:true,fev1_pct:80,cardiac_clearance:true,infectious_clearance:true,psychosocial_done:true,financial_counseling:true}],
  ['c_cm','/api/tx_candidate/crossmatch',{donor_id:'D1',recipient_id:'C1',crossmatch_result:'negative_t_cell',donor_age:35,cold_ischemia_hours:12,hla_mismatch_count:'3',donation_after_circulatory_death:false}],
  ['c_pra','/api/tx_candidate/pra',{candidate_id:'C1',pra_class1_pct:10,pra_class2_pct:5,undetectable_donors:true,previous_transplants:0,blood_transfusions:2}],
  ['c_wl','/api/tx_candidate/waiting_list',{candidate_id:'C1',meld_score:22,waiting_days:120,status:'active',priority:'meld_25_34',expedited_review:false}],

  ['d_typ','/api/tx_donor/donor_type',{donor_id:'D1',donor_type:'dbd',brain_death_confirmed:true,age:40,cause_of_death:'head_trauma',malignancy_history:false,serum_creatinine:1.0}],
  ['d_scr','/api/tx_donor/donor_screening',{donor_id:'D1',hiv_neg:true,hbv_neg:true,hcv_neg:true,htlv_neg:true,syphilis_neg:true,toxoplasmosis_neg:true,ebv_known:true,cmv_known:true}],
  ['d_alc','/api/tx_donor/allocation',{donor_id:'D1',organ:'kidney',allocation_type:'standard',distance_miles:200,cold_ischemia_target_h:24,allocation_score:'cpra'}],
  ['d_pre','/api/tx_donor/preservation',{donor_id:'D1',cold_ischemia_h:18,preservation_method:'static_cold_storage',organ_temperature_c:4,organ_pumped:false,pump_time_h:0}],
  ['d_pro','/api/tx_donor/procurement',{donor_id:'D1',cross_clamp_confirmed:true,operative_time_min:120,blood_loss_ml:300,all_organs_procured:true,complication:'none'}],

  ['i_ind','/api/tx_immuno/induction',{recipient_id:'R1',induction_agent:'basiliximab',dose_total:40,days_since_tx:3,rejection_risk:'moderate',cni_initiated:true}],
  ['i_mnt','/api/tx_immuno/maintenance',{recipient_id:'R1',cni:'tacrolimus',tacrolimus_trough_ng_ml:10,antimetabolite:'mycophenolate',steroid_maintenance:true,days_post_tx:120}],
  ['i_rej','/api/tx_immuno/rejection',{episode_id:'E1',rejection_type:'acute_cellular',banff_grade:'1a',dsa_mfi:2000,steroid_pulse_given:true,plasmapheresis_done:false}],
  ['i_drg','/api/tx_immuno/drug_level',{recipient_id:'R1',drug:'tacrolimus',trough_ng_ml:9,days_post_tx:60,adherence_concern:false,adjustment:'maintain'}],
  ['i_pro','/api/tx_immuno/prophylaxis',{recipient_id:'R1',pjp_prophylaxis:'tmp_smx',cmv_prophylaxis:'valganciclovir',days_post_tx:30,bk_virus_detected:false,ebv_high_risk:false}],

  ['o_gft','/api/tx_outcome/graft_function',{recipient_id:'R1',organ:'kidney',days_post_tx:60,creatinine_post_tx:1.4,egfr_post_tx:55,dialysis_needed_post_tx:false,primary_nonfunction:false}],
  ['o_inf','/api/tx_outcome/infection_post',{episode_id:'E2',organ:'kidney',days_post_tx:60,infection_type:'bacterial',wbc:14000,hospitalized:true,severity:'moderate'}],
  ['o_mal','/api/tx_outcome/malignancy_post',{episode_id:'E3',malignancy_type:'skin_scc',days_post_tx:600,immunosuppression_reduced:true,stage:'local',refer_oncology:true}],
  ['o_cv','/api/tx_outcome/cv_complication',{episode_id:'E4',event_type:'afib_new',days_post_tx:200,lvef:50,statins_given:true,anticoagulated:false}],
  ['o_ren','/api/tx_outcome/renal_function',{recipient_id:'R1',days_post_tx:120,egfr:55,proteinuria_g:0.3,bun:20,biopsy_needed:false}],

  ['f_sur','/api/tx_followup/surveillance',{recipient_id:'R1',days_post_tx:200,bk_virus_qpcr_done:true,cmv_qpcr_done:true,donor_specific_antibody_done:true,protocol_biopsy_done:false,compliance:'excellent'}],
  ['f_rto','/api/tx_followup/return_to_or',{episode_id:'E5',reason:'ureteral_complication',days_post_tx:14,urgent:false,graft_salvaged:true,graft_lost:false}],
  ['f_ret','/api/tx_followup/retransplant',{candidate_id:'C2',previous_transplants:1,days_graft_lost:2000,days_since_relisting:90,reason_prev_failure:'rejection_chronic',immunology_workup_redone:true}],
  ['f_lq','/api/tx_followup/life_quality',{recipient_id:'R1',months_post_tx:24,karnofsky_score:90,returned_to_work:true,exercise_tolerance:true,satisfaction_score:9}],
  ['f_tc','/api/tx_followup/transition_care',{recipient_id:'R1',age:35,adolescent:false,adult_care_takeover:true,insurance_active:true,days_since_last_visit:30}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\tx_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_tx_tier24.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);