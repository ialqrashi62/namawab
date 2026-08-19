// filepath: test_tier86_engines.js
const engines = [
  ['tier86_card_ext_453_card_heart_failure_engine', 453, 0, ['hf_initial','hf_followup','cardiomyopathy','aldosterone_antag','heart_transplant']],
  ['tier86_card_ext_454_card_intervention_engine', 454, 5, ['cath_followup','pci_followup','cabg_followup','structural_followup','tavr_followup']],
  ['tier86_card_ext_455_card_imaging_engine', 455, 10, ['echo_followup','stress_test','nuclear_imaging','cardiac_mri','cardiac_ct_angio']],
  ['tier86_card_ext_456_card_rehab_engine', 456, 15, ['cr_initial','cr_phase2','cr_discharge','cr_followup','cr_outcomes']],
  ['tier86_card_ext_457_card_arrhythmia_engine', 457, 20, ['afib_initial','afib_followup','anticoag_clinic','vt_eval','device_check']]
];
let passed=0,failed=0;
for(const[engFile,_,baseIdx,eps]of engines){const e=require('./'+engFile);const fns=e.funcs();for(let i=0;i<eps.length;i++){const bodyIdx=baseIdx+i;let body;try{body=JSON.parse(require('fs').readFileSync(`C:/tmp/card_body_${bodyIdx}.json`,'utf8'))}catch(err){console.log(`SKIP ${engFile}.${eps[i]}`);continue}try{fns[eps[i]](body);console.log(`OK  ${engFile}.${eps[i]}`);passed++}catch(err){console.log(`FAIL ${engFile}.${eps[i]} (body ${bodyIdx}): ${err.message}`);failed++}}}
console.log(`\nEngine self-test: PASS=${passed} FAIL=${failed}`);
process.exit(failed>0?1:0);
