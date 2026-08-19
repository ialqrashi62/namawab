// filepath: test_tier88_engines.js
const engines = [
  ['tier88_id_general_463_engine', 463, 0, ['id_clinic','fever_workup','sepsis','tb','hiv_visit']],
  ['tier88_id_syndromes_464_engine', 464, 5, ['endocarditis','meningitis','osteomyelitis','skin_infection','uti_id']],
  ['tier88_gi_luminal_465_engine', 465, 10, ['endoscopy','colonoscopy','ercp','ercp_therapeutic','capsule_endoscopy']],
  ['tier88_gi_liver_466_engine', 466, 15, ['hepatitis_clinic_gi','cirrhosis','liver_mass','liver_transplant','portal_htn']],
  ['tier88_id_specialty_467_engine', 467, 20, ['hiv_specialist','hepatitis_clinic','travel_medicine','fever_unknown_origin','antimicrobial_stewardship']]
];
let passed=0,failed=0;
for(const[engFile,_,baseIdx,eps]of engines){const e=require('./'+engFile);const fns=e.funcs();for(let i=0;i<eps.length;i++){const bodyIdx=baseIdx+i;let body;try{body=JSON.parse(require('fs').readFileSync(`C:/tmp/multi_body_${bodyIdx}.json`,'utf8'))}catch(err){console.log(`SKIP ${engFile}.${eps[i]}`);continue}try{fns[eps[i]](body);console.log(`OK  ${engFile}.${eps[i]}`);passed++}catch(err){console.log(`FAIL ${engFile}.${eps[i]} (body ${bodyIdx}): ${err.message}`);failed++}}}
console.log(`\nEngine self-test: PASS=${passed} FAIL=${failed}`);
process.exit(failed>0?1:0);
