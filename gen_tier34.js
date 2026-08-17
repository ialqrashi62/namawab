// filepath: gen_tier34.js
const fs = require('fs');

const routes = [
  [203, 'ibd', 'ibd_classification,ibd_disease_activity,ibd_medication,ibd_surveillance,ibd_surgery'],
  [204, 'hepatology', 'liver_function,hepatitis_b,hepatitis_c,nafld_mash,liver_transplant'],
  [205, 'endoscopy', 'egd_findings,colonoscopy_quality,ercp,eus_evaluation,endoscopic_bleeding'],
  [206, 'gi_oncology', 'colon_cancer_staging,gi_lymphoma,gist,pancreatic_cancer,neuroendocrine_tumor'],
  [207, 'gi_nutrition', 'malnutrition_screen,enteral_nutrition,parenteral_nutrition,gi_diet_therapy,fecal_microbiota'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier34_gastroenterology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier34_gastroenterology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier34_gastroenterology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['g_ic','/api/gi_ibd/ibd_classification',{patient_id:'IBD1',ibd_type:'crohns',age_at_diagnosis:25,disease_location:'ileal',disease_behavior:'stricturing',extra_intestinal:'arthritis'}],
  ['g_da','/api/gi_ibd/ibd_disease_activity',{patient_id:'IBD2',ibd_type:'uc',crp_mg_l:25,calprotectin_ug_g:600,mayo_score:8,sccai_score:5,flare_status:'moderate'}],
  ['g_im','/api/gi_ibd/ibd_medication',{patient_id:'IBD3',medication:'infliximab',dose_mg:5,interval_weeks:8,antibody_present:false,response:'maintained',biosim_switched:false}],
  ['g_sur','/api/gi_ibd/ibd_surveillance',{patient_id:'IBD4',years_diagnosis:12,last_colonoscopy_date:'2024-01-15',surveillance_interval_years:3,dysplasia_found:false,chromoendoscopy_done:true}],
  ['g_sx','/api/gi_ibd/ibd_surgery',{patient_id:'IBD5',surgery_type:'ileocecal_resection',indication:'stricture',laparoscopic:true,complication:'none',recurrence:'none'}],

  ['g_lf','/api/gi_hepa/liver_function',{patient_id:'H1',ast:55,alt:62,alp:140,total_bilirubin:1.2,albumin:3.8,pattern:'hepatocellular'}],
  ['g_hb','/api/gi_hepa/hepatitis_b',{patient_id:'H2',hbsag:'positive',hbeag:'negative',hbv_dna_iu_ml:2000,alt:45,phase:'immune_inactive',treatment_needed:false}],
  ['g_hc','/api/gi_hepa/hepatitis_c',{patient_id:'H3',hcv_ab:'positive',hcv_rna:'positive',genotype:1,viral_load_iu_ml:850000,fibrosis_stage:'f2',treatment_eligible:true}],
  ['g_nafld','/api/gi_hepa/nafld_mash',{patient_id:'H4',bmi:35,alt:42,ast:38,fibroscan_kpa:9.8,cap_score:330,steatosis_grade:'severe',fibrosis:'f2'}],
  ['g_ltx','/api/gi_hepa/liver_transplant',{patient_id:'H5',meld:22,indication:'decompensated_cirrhosis',evaluated:true,listed:true,waiting_time_months:6}],

  ['g_egd','/api/gi_end/egd_findings',{patient_id:'E1',indication:'dyspepsia',findings:'gastric_erosions',biopsies_taken:true,barretts_suspected:false,complication:'none'}],
  ['g_col','/api/gi_end/colonoscopy_quality',{patient_id:'E2',bowel_prep:'adequate',cecum_intubated:true,withdrawal_time_min:9,adenoma_detection_rate:35,polyp_count:2}],
  ['g_ercp','/api/gi_end/ercp',{patient_id:'E3',indication:'choledocholithiasis',sphincterotomy:true,stone_extracted:true,stent_placed:false,complication:'none'}],
  ['g_eus','/api/gi_end/eus_evaluation',{patient_id:'E4',indication:'pancreatic_mass',mass_size_mm:25,fna_done:true,pathology:'adenocarcinoma',t_stage:'t2'}],
  ['g_ebl','/api/gi_end/endoscopic_bleeding',{patient_id:'E5',source:'variceal',hemorrhagic_shock:false,therapy_applied:'band_ligation',rebleeding_risk:'moderate',transfusion_units:2}],

  ['g_cc','/api/gi_onco/colon_cancer_staging',{patient_id:'O1',tnm_stage:'t3n1m0',cea:8,lymph_nodes_positive:2,surgery_done:true,chemotherapy_regimen:'folfox',msi_status:'mss'}],
  ['g_ln','/api/gi_onco/gi_lymphoma',{patient_id:'O2',lymphoma_type:'malt',location:'stomach',h_pylori_positive:true,stage:'ie',treatment:'triple_therapy'}],
  ['g_gist','/api/gi_onco/gist',{patient_id:'O3',location:'stomach',size_cm:6,mitotic_index:'low','c-kit_positive':true,imatinib_started:true,response:'stable'}],
  ['g_pc','/api/gi_onco/pancreatic_cancer',{patient_id:'O4',stage:'resectable',ca_19_9:450,whipple_planned:true,neoadjuvant_chemo:'gemcitabine_nab_paclitaxel',response:'partial'}],
  ['g_net','/api/gi_onco/neuroendocrine_tumor',{patient_id:'O5',primary_site:'small_bowel',grade:'g1',octreotide_scan_positive:true,ki67:2,functional:true,treatment:'octreotide'}],

  ['g_ms','/api/gi_nut/malnutrition_screen',{patient_id:'N1',albumin:2.8,weight_loss_pct:8,bmi:18.5,sga_grade:'b',risk_level:'moderate'}],
  ['g_ent','/api/gi_nut/enteral_nutrition',{patient_id:'N2',route:'ng_tube',formula:'standard_isotonic',goal_kcal:2000,current_intake_pct:75,tolerance:'good'}],
  ['g_pn','/api/gi_nut/parenteral_nutrition',{patient_id:'N3',route:'central',dextrose_pct:20,amino_acids_pct:5,lipids_pct:20,total_kcal:2200,complication:'none'}],
  ['g_diet','/api/gi_nut/gi_diet_therapy',{patient_id:'N4',diet_type:'low_fodmap',condition:'ibs',response:'improving',duration_weeks:6,adherence:'good'}],
  ['g_fmt','/api/gi_nut/fecal_microbiota',{patient_id:'N5',indication:'recurrent_c_diff',donor_source:'stool_bank',route:'colonoscopy',response:'resolved',follow_up:90}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\gi_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_gi_tier34.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);