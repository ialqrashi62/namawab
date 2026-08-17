// filepath: gen_tier46.js
const fs = require('fs');

const routes = [
  [263, 'pharm_onco', 'chemo_regimen,targeted_therapy,immunotherapy,supportive_care,chemo_toxicity'],
  [264, 'pharm_antinf', 'antibiotic_stewardship,antifungal_therapy,antiviral_therapy,antiparasitic,resistance_review'],
  [265, 'pharm_chronic', 'antihypertensive,antidiabetic,statin_therapy,anticoagulation_oral,asthma_controller'],
  [266, 'pharm_pain', 'opioid_chronic_pain,nsaid,neuropathic_pain,palliative_pain,multimodal_pain'],
  [267, 'pharm_special', 'biologic_therapy,controlled_substance,compounding,investigational_drug,drug_shortage'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier46_pharmacy_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier46_pharmacy_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier46_pharmacy_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['p_che','/api/pharm_onco/chemo_regimen',{patient_id:'PH1',regimen:'r_chop',cycle:3,dose_reduction_pct:0,toxicity_grade:1,response:'partial_response',next_cycle:'planned'}],
  ['p_tar','/api/pharm_onco/targeted_therapy',{patient_id:'PH2',target:'her2',drug:'trastuzumab',mutation_tested:'her2_positive',line:1,response:'ongoing'}],
  ['p_imm','/api/pharm_onco/immunotherapy',{patient_id:'PH3',class:'pdl1_inhibitor',drug:'pembrolizumab',ir_ae:'hepatitis_grade2',response:'stable_disease',monitoring:'q3_weeks'}],
  ['p_sup','/api/pharm_onco/supportive_care',{patient_id:'PH4',support:'antiemetic_growth_factor',antiemetic:'olanzapine_dexamethasone',growth_factor:'pegfilgrastim',response:'tolerable'}],
  ['p_tox','/api/pharm_onco/chemo_toxicity',{patient_id:'PH5',agent:'cisplatin',toxicity_type:'nephrotoxicity',grade:3,intervention:'hydration_dose_reduction',recovery:'partial'}],

  ['p_stw','/api/pharm_antinf/antibiotic_stewardship',{patient_id:'PI1',indication:'pneumonia',culture:'s_pneumoniae_sensitive',antibiotic:'ceftriaxone',de_escalation:'planned_48h',iv_to_oral:'planned'}],
  ['p_fun','/api/pharm_antinf/antifungal_therapy',{patient_id:'PI2',indication:'invasive_candidiasis',drug:'echinocandin',culture:'candida_albicans',duration_days:14,response:'improving'}],
  ['p_vir','/api/pharm_antinf/antiviral_therapy',{patient_id:'PI3',indication:'influenza_a',drug:'oseltamivir',onset_hours:24,severity:'moderate',response:'improving'}],
  ['p_par','/api/pharm_antinf/antiparasitic',{patient_id:'PI4',parasite:'malaria_p_falciparum',drug:'artemether_lumefantrine',severity:'uncomplicated',response:'clearing'}],
  ['p_res','/api/pharm_antinf/resistance_review',{patient_id:'PI5',culture:'e_coli',pattern:'esbl_positive',antibiotics_active:'meropenem',monitoring:'repeat_culture_72h'}],

  ['p_htn','/api/pharm_chronic/antihypertensive',{patient_id:'PC1',bp:160,comorbidities:'diabetes',first_line:'ace_inhibitor',combination_needed:true,adherence:'good'}],
  ['p_dm','/api/pharm_chronic/antidiabetic',{patient_id:'PC2',hba1c:8.5,egfr:65,first_line:'metformin',second_line:'sglt2',comorbidities:'heart_failure',glycemic_target:'individualized'}],
  ['p_sta','/api/pharm_chronic/statin_therapy',{patient_id:'PC3',ldl:140,risk:'high',statin:'atorvastatin_40mg',intolerance:false,monitoring:'lipid_3_months'}],
  ['p_aco','/api/pharm_chronic/anticoagulation_oral',{patient_id:'PC4',indication:'atrial_fibrillation',cha2ds2_vasc:4,drug:'apixaban_5mg',bleeding_risk:'moderate',monitoring:'renal_q3_months'}],
  ['p_ast','/api/pharm_chronic/asthma_controller',{patient_id:'PC5',severity:'moderate_persistent',controller:'ics_laba',ics_dose:'medium',adherence:'good',follow_up:3}],

  ['p_opi','/api/pharm_pain/opioid_chronic_pain',{patient_id:'PP1',morphine_equivalent_dose:80,duration_months:6,urine_drug_screen:'consistent',naloxone:true,referral:'pain_clinic'}],
  ['p_nsa','/api/pharm_pain/nsaid',{patient_id:'PP2',indication:'osteoarthritis',duration_weeks:8,gi_risk:'high',cv_risk:'moderate',choice:'celecoxib_with_ppi',monitoring:'renal'}],
  ['p_nrp','/api/pharm_pain/neuropathic_pain',{patient_id:'PP3',condition:'diabetic_neuropathy',first_line:'gabapentin',second_line:'duloxetine',response:'partial',adjuvant:'capsaicin'}],
  ['p_pal','/api/pharm_pain/palliative_pain',{patient_id:'PP4',pain_score:7,route:'subcutaneous',opioid:'morphine_sulfate',bowel_regimen:'started',adjuvants:'gabapentin_dexamethasone'}],
  ['p_mul','/api/pharm_pain/multimodal_pain',{patient_id:'PP5',surgery:'total_knee',protocol:'enhanced_recovery',components:'nerve_block_acetaminophen_nsaid_opioid_sparing',discharge_plan:'planned_day_2'}],

  ['p_bio','/api/pharm_special/biologic_therapy',{patient_id:'PS1',class:'tnf_inhibitor',drug:'adalimumab',indication:'rheumatoid_arthritis',screening_tb:'negative_hepatitis_b_screen',monitoring:'q3_months'}],
  ['p_ctr','/api/pharm_special/controlled_substance',{patient_id:'PS2',drug:'alprazolam',schedule:4,quantity:30,refills:0,pdmp_checked:true,diversion_risk:'low'}],
  ['p_cmp','/api/pharm_special/compounding',{patient_id:'PS3',preparation:'suspension',active:'spironolactone',beyond_use_date:'14_days',sterility:'non_sterile',stability:'assigned'}],
  ['p_inv','/api/pharm_special/investigational_drug',{patient_id:'PS4',trial:'phase_2',indication:'nsclc_egfr',consent_obtained:true,ind_number:'IND123456',adverse_event_tracking:'in_place'}],
  ['p_sht','/api/pharm_special/drug_shortage',{patient_id:'PS5',drug:'gentamicin',alternative:'tobramycin',affected_doses:'reduced_stock',action:'rationed_critical_only',communication:'physicians_notified'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\phr_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_phr_tier46.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);