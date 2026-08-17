// filepath: gen_tier36.js
const fs = require('fs');

const routes = [
  [213, 'hiv', 'hiv_diagnosis,art_initiation,viral_load_monitoring,opportunistic_infection,hiv_prep'],
  [214, 'tb', 'tb_diagnosis,active_tb_treatment,latent_tb,drug_resistant_tb,tb_contact_tracing'],
  [215, 'hepatitis', 'hepatitis_a,hepatitis_d,hepatitis_e,chronic_hepb_management,chronic_hepc_daa'],
  [216, 'tropical', 'malaria,dengue,typhoid,chikungunya,parasitic_infection'],
  [217, 'stewardship', 'culture_review,antibiotic_review,iv_to_po,de_escalation,prospective_audit'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier36_infectious_disease_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier36_infectious_disease_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier36_infectious_disease_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['i_hd','/api/infx_hiv/hiv_diagnosis',{patient_id:'H1',test_type:'fourth_gen_ag_ab',result:'reactive',confirmation:'positive',cd4:350,viral_load:50000,stage:'chronic'}],
  ['i_ai','/api/infx_hiv/art_initiation',{patient_id:'H2',cd4:280,regimen:'bictegravir_tenofovir_lamivudine',baseline_resistance:'none',side_effects:'none',adherence_plan:'pillbox'}],
  ['i_vl','/api/infx_hiv/viral_load_monitoring',{patient_id:'H3',viral_load:50,cd4:600,suppressed:true,monitoring_interval:'6_month',resistance_concern:false}],
['i_oi','/api/infx_hiv/opportunistic_infection',{patient_id:'H4',oi_type:'pjp',cd4:120,prophylaxis:'tmp_smx',treatment_active:'iv_tmp_smx',response:'improving'}],
  ['i_prep','/api/infx_hiv/hiv_prep',{patient_id:'H5',risk_assessment:'high',prep_regimen:'tenofovir_emtricitabine',baseline_hiv_negative:true,follow_up_3_months:true}],

  ['i_tbd','/api/infx_tb/tb_diagnosis',{patient_id:'T1',symptoms:'chronic_cough_fever',sputum_afb:'positive',genexpert:'mtb_detected_rif_sensitive',cxr_cavitary:true,hiv_positive:false}],
  ['i_atb','/api/infx_tb/active_tb_treatment',{patient_id:'T2',regimen:'hrze',intensive_phase:2,continuation_phase:4,adherence:'dot',response:'improving'}],
['i_ltb','/api/infx_tb/latent_tb',{patient_id:'T3',test:'igra_positive',cxr_normal:true,symptoms:'none',prophylaxis:'isoniazid_6_month',baseline_lft:true}],
  ['i_drt','/api/infx_tb/drug_resistant_tb',{patient_id:'T4',resistance_pattern:'mdr',genexpert:'mtb_detected_rif_resistant',hain_test:'inh_resistant',regimen:'bedaquiline_linezolid',treatment_duration_months:18}],
  ['i_ct','/api/infx_tb/tb_contact_tracing',{patient_id:'T5',index_case:'pulmonary',contact_type:'household',contact_count:3,screening_done:true,latent_tb_identified:1}],

  ['i_ha','/api/infx_hepa/hepatitis_a',{patient_id:'A1',igm_anti_hav:'positive',alt:1200,severity:'moderate',vaccination_history:'unvaccinated',treatment:'supportive'}],
  ['i_hd2','/api/infx_hepa/hepatitis_d',{patient_id:'A2',hbsag:'positive',anti_hdv_igm:'positive',coinfection:'acute_superinfection',hbv_dna:15000,severity:'severe'}],
  ['i_he','/api/infx_hepa/hepatitis_e',{patient_id:'A3',igm_anti_hev:'positive',alt:850,severity:'mild',travel_history:'endemic_area',treatment:'supportive'}],
  ['i_chb','/api/infx_hepa/chronic_hepb_management',{patient_id:'A4',hbsag_duration_years:5,hbv_dna:20000,alt:80,liver_biopsy_fibrosis:'f2',treatment_initiated:'tenofovir',monitoring_6_month:true}],
  ['i_chc','/api/infx_hepa/chronic_hepc_daa',{patient_id:'A5',genotype:3,viral_load:1500000,cirrhosis:false,regimen:'sofosbuvir_velpatasvir',duration_weeks:12,sustained_virologic_response:12}],

  ['i_mal','/api/infx_trop/malaria',{patient_id:'M1',species:'falciparum',parasitemia_pct:2,severity:'uncomplicated',treatment:'act',travel_return:7}],
  ['i_den','/api/infx_trop/dengue',{patient_id:'M2',igm_positive:true,platelet:35000,hct:48,severity:'dengue_with_warning_signs',treatment:'supportive_fluid'}],
  ['i_typh','/api/infx_trop/typhoid',{patient_id:'M3',culture:'blood_positive',sensitivity:'sensitive',severity:'moderate',treatment:'ceftriaxone',complication:'none'}],
  ['i_chik','/api/infx_trop/chikungunya',{patient_id:'M4',igm_positive:true,arthralgia:'chronic',severity:'moderate',treatment:'supportive_nsaids',chronicity:'chronic_persistent'}],
  ['i_par','/api/infx_trop/parasitic_infection',{patient_id:'M5',parasite:'strongyloides',stool_ova:false,serology:'positive',treatment:'ivermectin',follow_up:90}],

  ['i_cr','/api/infx_stew/culture_review',{patient_id:'S1',culture_result:'ecoli',specimen:'urine',sensitivities:'multiple',antibiotic_appropriateness:'appropriate',de_escalation_needed:true}],
  ['i_ar','/api/infx_stew/antibiotic_review',{patient_id:'S2',antibiotic:'vancomycin',indication:'culture_positive',dose_appropriate:true,levels_monitored:true,renal_dose_adjustment:false}],
  ['i_ivpo','/api/infx_stew/iv_to_po',{patient_id:'S3',antibiotic:'levofloxacin',afebrile_24h:true,oral_tolerance:true,switch_to_po:true,iv_line_discontinued:true}],
  ['i_de','/api/infx_stew/de_escalation',{patient_id:'S4',empiric:'pip_tazo',culture:'ecoli_sensitive_narrow',de_escalate_to:'ceftriaxone',narrower_spectrum:true}],
  ['i_pa','/api/infx_stew/prospective_audit',{patient_id:'S5',audit_type:'daily_review',antibiotic_days:5,intervention_needed:true,intervention:'dose_optimization',outcome:'resolved'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\infx_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_infx_tier36.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);