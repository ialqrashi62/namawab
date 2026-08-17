// filepath: gen_tier53.js
const fs = require('fs');

const routes = [
  [298, 'onc_breast', 'early_breast_cancer,advanced_breast_cancer,dcis,her2_pos_breast,triple_neg_breast'],
  [299, 'onc_lung', 'nsclc_early,nsclc_advanced,sclc_limited,sclc_extensive,mesothelioma'],
  [300, 'onc_gi', 'colon_cancer,rectal_cancer,pancreatic_cancer,gastric_cancer,esophageal_cancer'],
  [301, 'onc_gu', 'renal_cancer,bladder_cancer,prostate_cancer,testicular_cancer,ovarian_cancer'],
  [302, 'onc_heme', 'aml,all,cml,cll,nhl_lymphoma'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier53_oncology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier53_oncology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier53_oncology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['o_ebr','/api/onc_breast/early_breast_cancer',{patient_id:'OB1',stage:'t1n0m0',histology:'invasive_ductal',grade:'grade_2',er:'positive',pr:'positive',her2:'negative',treatment:'surgery_then_chemo',response:'planned'}],
  ['o_adv','/api/onc_breast/advanced_breast_cancer',{patient_id:'OB2',stage:'t4n2m1_oligometastatic',site_metastasis:'bone_liver',line:2,treatment:'chemo_her2_targeted',response:'stable_disease'}],
  ['o_dci','/api/onc_breast/dcis',{patient_id:'OB3',grade:'high',size_mm:25,margins:'close_1mm',treatment:'lumpectomy_radiation',response:'planned'}],
  ['o_h2p','/api/onc_breast/her2_pos_breast',{patient_id:'OB4',her2_ihc:3,fish_ratio:6.5,regimen:'tcbh',cycles_planned:6,cardiac_ejection_fraction:62,response:'ongoing'}],
  ['o_tnb','/api/onc_breast/triple_neg_breast',{patient_id:'OB5',brca_status:'brca1_carrier',regimen:'keynote_522_chemo_pembro',cycles_completed:3,response:'partial_response',follow_up:3}],

  ['o_nel','/api/onc_lung/nsclc_early',{patient_id:'OL1',stage:'ib',histology:'adenocarcinoma',egfr:'wild_type',alk:'negative',surgery:'lobectomy_planned',adjuvant_chemo:'planned',follow_up_years:5}],
  ['o_nla','/api/onc_lung/nsclc_advanced',{patient_id:'OL2',stage:'iv_oligometastatic',mutations:'egfr_exon_19_del',line:1,treatment:'osimertinib_targeted',response:'partial_response',monitoring:'q3_months_ctdna'}],
  ['o_scl','/api/onc_lung/sclc_limited',{patient_id:'OL3',stage:'limited',ps:1,treatment:'chemo_etoposide_platinum_with_concurrent_rt',cycles:4,response:'partial_response',prophylactic_cranial_radiation:'planned'}],
  ['o_sce','/api/onc_lung/sclc_extensive',{patient_id:'OL4',stage:'extensive_brain_metastases_present',ps:2,line:1,treatment:'chemo_immunotherapy_atezo_chemo',response:'mixed_response'}],
  ['o_mes','/api/onc_lung/mesothelioma',{patient_id:'OL5',type:'pleural',histology:'epithelioid',stage:'iii',treatment:'chemo_pemetrexed_platinum_bevacizumab',response:'stable'}],

  ['o_col','/api/onc_gi/colon_cancer',{patient_id:'OG1',stage:'iiia_t1n2m0',sidedness:'left',microsatellite:'mss',ras:'wild_type',treatment:'surgery_then_adjuvant_chemo',response:'monitoring'}],
  ['o_rec','/api/onc_gi/rectal_cancer',{patient_id:'OG2',stage:'t3n1_m0',mesorectal_fascia:'threatened',treatment:'neoadjuvant_chemoradiation_surgery',response:'planned_total_mesorectal_excision'}],
  ['o_pan','/api/onc_gi/pancreatic_cancer',{patient_id:'OG3',stage:'resectable_head',ca_19_9:580,treatment:'surgery_neoadjuvant_then_adjuvant',response:'planned_whipple'}],
  ['o_gas','/api/onc_gi/gastric_cancer',{patient_id:'OG4',stage:'t3n2m0',her2:'positive',treatment:'chemo_her2_trastuzumab_surgery',response:'ongoing'}],
  ['o_eso','/api/onc_gi/esophageal_cancer',{patient_id:'OG5',type:'adenocarcinoma_ge_junction',stage:'t2n1m0',treatment:'neoadjuvant_chemoradiation_surgery',response:'planned_chemoradiation_then_surgery'}],

  ['o_ren','/api/onc_gu/renal_cancer',{patient_id:'OGU1',stage:'t1b_n0_m0',histology:'clear_cell',risk:'low',treatment:'partial_nephrectomy',follow_up_imaging:6}],
  ['o_bla','/api/onc_gu/bladder_cancer',{patient_id:'OGU2',stage:'nmi_high_grade',treatment:'turbt_then_bcg_intravesical',response:'induction_6_weeks_completed',surveillance_cytology:'planned'}],
  ['o_pro','/api/onc_gu/prostate_cancer',{patient_id:'OGU3',stage:'t2_n0_m0_intermediate_risk',psa:8.5,gleason:7,pirads:4,treatment:'radical_prostatectomy_planned',follow_up:3}],
  ['o_tes','/api/onc_gu/testicular_cancer',{patient_id:'OGU4',stage:'i_seminoma',tumor_markers_afp:'normal',treatment:'surveillance_or_chemotherapy_1_cycle',response:'good_prognosis'}],
  ['o_ova','/api/onc_gu/ovarian_cancer',{patient_id:'OGU5',stage:'iiic_high_grade_serous',brca:'wild_type',treatment:'debulking_surgery_then_chemo_parp_planned',response:'planned'}],

  ['o_aml','/api/onc_heme/aml',{patient_id:'OH1',subtype:'de_novo',cytogenetics:'intermediate_risk',induction:'7_plus_3',response:'morphologic_remission',consolidation:'high_dose_chemotherapy_hct_planned'}],
  ['o_all','/api/onc_heme/all',{patient_id:'OH2',type:'b_cell_ph_negative',age:8,risk:'standard',induction:'all_re InductionProtocol',response:'end_induction_mrd_negative',maintenance_phase_yr:2}],
  ['o_cml','/api/onc_heme/cml',{patient_id:'OH3',phase:'chronic',bcr_abl:'detected',treatment:'tk_imatinib_dasatinib',molecular_response_qtr:0.08,response:'deep_response_major_molecular'}],
  ['o_cll','/api/onc_heme/cll',{patient_id:'OH4',rai_stage:'ii',tp53:'unmutated',treatment:'ibrutinib_obinutuzumab_continuous',response:'stable_disease','follow_up':3}],
  ['o_nhl','/api/onc_heme/nhl_lymphoma',{patient_id:'OH5',type:'diffuse_large_b_cell',stage:'i_aa',ipi:1,treatment:'r_chop_6_cycles',interim_response:'complete_after_3_cycles',final_response:'complete_remission'}],
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
fs.writeFileSync('sm_onc_tier53.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);