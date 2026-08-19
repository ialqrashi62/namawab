// filepath: test_tier87_engines.js
const engines = [
  ['tier87_neph_ext_458_neph_general_engine', 458, 0, ['neph_clinic','ckd_eval','ckd_followup','glomerulonephritis','polycystic_kidney']],
  ['tier87_neph_ext_459_neph_dialysis_engine', 459, 5, ['hemodialysis_initial','hemodialysis_followup','dialysis_adequacy','electrolyte_management','dry_weight']],
  ['tier87_neph_ext_460_neph_nephrology_engine', 460, 10, ['hypertension_renal','proteinuria_hematuria','renal_stones','renal_cyst','proteinuric_disease']],
  ['tier87_neph_ext_461_neph_geri_engine', 461, 15, ['geri_neph','elderly_ckd','gentiurian_dialysis','nephro_epidemic','nephro_global']],
  ['tier87_neph_ext_462_neph_advanced_engine', 462, 20, ['peritoneal_dialysis','transplant_clinic','dialysis_vascular_access','anemia_ckd','bone_metabolism_ckd']]
];
let passed=0,failed=0;
for(const[engFile,_,baseIdx,eps]of engines){const e=require('./'+engFile);const fns=e.funcs();for(let i=0;i<eps.length;i++){const bodyIdx=baseIdx+i;let body;try{body=JSON.parse(require('fs').readFileSync(`C:/tmp/neph_body_${bodyIdx}.json`,'utf8'))}catch(err){console.log(`SKIP ${engFile}.${eps[i]}`);continue}try{fns[eps[i]](body);console.log(`OK  ${engFile}.${eps[i]}`);passed++}catch(err){console.log(`FAIL ${engFile}.${eps[i]} (body ${bodyIdx}): ${err.message}`);failed++}}}
console.log(`\nEngine self-test: PASS=${passed} FAIL=${failed}`);
process.exit(failed>0?1:0);
