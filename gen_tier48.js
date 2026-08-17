// filepath: gen_tier48.js
const fs = require('fs');

const routes = [
  [273, 'lab_heme', 'complete_blood_count,coagulation_panel,d_dimer,fibrinogen,blood_smear'],
  [274, 'lab_chem', 'basic_metabolic,comprehensive_metabolic,liver_function,lipid_panel,thyroid_function'],
  [275, 'lab_micro', 'blood_culture,urine_culture,sputum_culture,stool_culture,wound_culture'],
  [276, 'lab_immuno', 'autoimmune_panel,immunoglobulins,complement_levels,cytokines,allergy_panel'],
  [277, 'lab_mol', 'pcr_panel,next_gen_sequencing,fish_analysis,karyotyping,methylation_assay'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier48_laboratory_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier48_laboratory_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier48_laboratory_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['l_cbc','/api/lab_heme/complete_blood_count',{patient_id:'L1',wbc:7.5,hgb:13.2,hct:39,plt:250,mcv:88,rdw:13,interpretation:'normal'}],
  ['l_coa','/api/lab_heme/coagulation_panel',{patient_id:'L2',pt:12.5,ptt:32,innr:1.1,fibrinogen:280,bleeding_time:5,interpretation:'normal_coagulation'}],
  ['l_ddi','/api/lab_heme/d_dimer',{patient_id:'L3',d_dimer:0.8,unit:'ug_ml_feu',clinical_context:'suspected_pe',age_adjusted:false,result:'negative_low_probability'}],
  ['l_fib','/api/lab_heme/fibrinogen',{patient_id:'L4',fibrinogen:180,clinical_context:'d_ic_evaluation',trend:'low_normal',interpretation:'consumed_dic_suspected'}],
  ['l_bsm','/api/lab_heme/blood_smear',{patient_id:'L5',findings:'normocytic_normochromic_no_blasts',schistocytes:false,target_cells:false,interpretation:'normal'}],

  ['l_bmp','/api/lab_chem/basic_metabolic',{patient_id:'LC1',sodium:140,potassium:4.2,chloride:102,bicarbonate:24,bun:14,creatinine:0.9,glucose:95,interpretation:'normal'}],
  ['l_cmp','/api/lab_chem/comprehensive_metabolic',{patient_id:'LC2',sodium:138,potassium:4.5,chloride:100,bicarbonate:25,bun:18,creatinine:1.0,glucose:110,albumin:4.0,total_protein:7.2,interpretation:'normal'}],
  ['l_lft','/api/lab_chem/liver_function',{patient_id:'LC3',ast:22,alt:24,alp:75,ggt:35,bilirubin_total:0.7,bilirubin_direct:0.2,albumin:4.2,interpretation:'normal_lft'}],
  ['l_lip','/api/lab_chem/lipid_panel',{patient_id:'LC4',total_chol:195,ldl:120,hdl:55,triglycerides:140,non_hdl:140,interpretation:'borderline_high_ldl'}],
  ['l_thy','/api/lab_chem/thyroid_function',{patient_id:'LC5',tsh:2.5,t4_free:1.2,t3_free:3.2,anti_tpo:25,interpretation:'normal_function'}],

  ['l_bcx','/api/lab_micro/blood_culture',{patient_id:'LM1',bottle_count:2,days_to_positive:1,organism:'staph_aureus',contaminant:false,susceptibility:'mssa',antibiotic_therapy:'nafcillin'}],
  ['l_ucx','/api/lab_micro/urine_culture',{patient_id:'LM2',cfu_per_ml:100000,organism:'e_coli',susceptibility:'cipro_sensitive',contamination:'clean_catch',interpretation:'significant_uti'}],
  ['l_scx','/api/lab_micro/sputum_culture',{patient_id:'LM3',quality:'adequate_bm25',organism:'pseudomonas_aeruginosa',susceptibility:'cefepime_sensitive',interpretation:'probable_pathogen'}],
  ['l_stx','/api/lab_micro/stool_culture',{patient_id:'LM4',organism:'salmonella_group_b',susceptibility:'cipro_sensitive',toxin_positive:false,interpretation:'enteric_pathogen'}],
  ['l_wcx','/api/lab_micro/wound_culture',{patient_id:'LM5',organism:'mrsa',susceptibility:'vancomycin_sensitive',polymicrobial:false,interpretation:'targeted_therapy'}],

  ['l_ai','/api/lab_immuno/autoimmune_panel',{patient_id:'LI1',ana:'positive_titer_1_320',ds_dna:'positive',smith_antibody:'positive',complement_c3:'low',complement_c4:'low',interpretation:'consistent_with_sle'}],
  ['l_ig','/api/lab_immuno/immunoglobulins',{patient_id:'LI2',igg:1200,iga:280,igm:150,ige:120,interpretation:'normal_levels'}],
  ['l_cmp','/api/lab_immuno/complement_levels',{patient_id:'LI3',c3:85,c4:18,ch50:35,interpretation:'c3_low_c4_normal','clinical_context':'post_streptococcal_gn'}],
  ['l_cyt','/api/lab_immuno/cytokines',{patient_id:'LI4',il6:120,tnf_alpha:35,il1_beta:8,crp:85,interpretation:'significant_inflammation'}],
  ['l_al','/api/lab_immuno/allergy_panel',{patient_id:'LI5',ige_total:450,specific_peanut:8.5,specific_shellfish:6.2,interpretation:'food_allergy_confirmed'}],

  ['l_pcr','/api/lab_mol/pcr_panel',{patient_id:'LP1',target:'sars_cov_2',ct_value:28,result:'positive',sample_type:'nasopharyngeal',platform:'cepheid'}],
  ['l_ngs','/api/lab_mol/next_gen_sequencing',{patient_id:'LP2',panel:'solid_tumor_500',mutations_found:['braf_v600e','tp53_r175h'],vus_count:3,tmb:8,msi:'stable'}],
  ['l_fsh','/api/lab_mol/fish_analysis',{patient_id:'LP3',probe:'her2_amplification',signals_ratio:6.0,interpretation:'positive_amplified',sample:'breast_carcinoma'}],
  ['l_kar','/api/lab_mol/karyotyping',{patient_id:'LP4',karyotype:'46_xy_t_9_22_q34_q11',interpretation:'philadelphia_positive_cml',resolution:'400_band'}],
  ['l_met','/api/lab_mol/methylation_assay',{patient_id:'LP5',gene:'mgmt',methylation_status:'methylated',interpretation:'favorable_response_temozolomide',sample:'glioblastoma'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\lab_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_lab_tier48.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);