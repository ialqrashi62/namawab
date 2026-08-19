// filepath: test_tier83_engines.js
const engines = [
  ['tier83_derm_ext_438_derm_general_engine', 438, 0, ['skin_exam','rash_eval','skin_biopsy','derm_visit','topical_prescription']],
  ['tier83_derm_ext_439_derm_onc_engine', 439, 5, ['melanoma_eval','bcc_scc','lymphoma','keratinocyte','derm_chemo']],
  ['tier83_derm_ext_440_derm_immuno_engine', 440, 10, ['psoriasis','eczema','dermatitis','acne','biologics']],
  ['tier83_derm_ext_441_derm_cosmetic_engine', 441, 15, ['botox','chemical_peel','laser','fillers','micro_needling']],
  ['tier83_derm_ext_442_derm_peds_engine', 442, 20, ['pediatric_eczema','congenital_nevi','birthmarks','atopic','papular']]
];
let passed=0,failed=0;
for(const[engFile,_,baseIdx,eps]of engines){const e=require('./'+engFile);const fns=e.funcs();for(let i=0;i<eps.length;i++){const bodyIdx=baseIdx+i;let body;try{body=JSON.parse(require('fs').readFileSync(`C:/tmp/derm_body_${bodyIdx}.json`,'utf8'))}catch(err){console.log(`SKIP ${engFile}.${eps[i]}`);continue}try{fns[eps[i]](body);console.log(`OK  ${engFile}.${eps[i]}`);passed++}catch(err){console.log(`FAIL ${engFile}.${eps[i]} (body ${bodyIdx}): ${err.message}`);failed++}}}
console.log(`\nEngine self-test: PASS=${passed} FAIL=${failed}`);
process.exit(failed>0?1:0);
