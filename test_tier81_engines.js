// filepath: test_tier81_engines.js
const engines = [
  ['tier81_uro_ext_428_uro_general_engine', 428, 0, ['uro_clinic','hematuria_workup','incontinence','urodynamics','prostate_benign']],
  ['tier81_uro_ext_429_uro_renal_engine', 429, 5, ['renal_stone','renal_mass','renal_failure','uti_management','prostate_biopsy']],
  ['tier81_uro_ext_430_uro_onco_engine', 430, 10, ['bladder_cancer','prostate_cancer','renal_cancer','testicular_cancer','uro_chemo']],
  ['tier81_uro_ext_431_uro_peds_engine', 431, 15, ['pediatric_enuresis','cryptorchidism','hypospadias','circumcision','pediatric_vesicoureteral']],
  ['tier81_uro_ext_432_uro_andrology_engine', 432, 20, ['erectile_dysfunction','infertility','peyronie_disease','vasectomy','vasectomy_reversal']]
];
let passed=0,failed=0;
for(const[engFile,_,baseIdx,eps]of engines){const e=require('./'+engFile);const fns=e.funcs();for(let i=0;i<eps.length;i++){const bodyIdx=baseIdx+i;let body;try{body=JSON.parse(require('fs').readFileSync(`C:/tmp/uro_body_${bodyIdx}.json`,'utf8'))}catch(err){console.log(`SKIP ${engFile}.${eps[i]}`);continue}try{fns[eps[i]](body);console.log(`OK  ${engFile}.${eps[i]}`);passed++}catch(err){console.log(`FAIL ${engFile}.${eps[i]} (body ${bodyIdx}): ${err.message}`);failed++}}}
console.log(`\nEngine self-test: PASS=${passed} FAIL=${failed}`);
process.exit(failed>0?1:0);
