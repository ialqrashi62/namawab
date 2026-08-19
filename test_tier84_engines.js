// filepath: test_tier84_engines.js
const engines = [
  ['tier84_psych_ext_443_psych_general_engine', 443, 0, ['psych_eval','intake','med_management','psychotherapy','discharge']],
  ['tier84_psych_ext_444_psych_anxiety_engine', 444, 5, ['anxiety_screen','ocd_eval','ptsd','panic','social_anxiety']],
  ['tier84_psych_ext_445_psych_mood_engine', 445, 10, ['depression','bipolar','pms_pmdd','postpartum','seasonal']],
  ['tier84_psych_ext_446_psych_sud_engine', 446, 15, ['alcohol','opioid','cannabis','stimulant','dual_diagnosis']],
  ['tier84_psych_ext_447_psych_emerg_engine', 447, 20, ['suicidal','psych_emerg_eval','restraint','psychosis','crisis']]
];
let passed=0,failed=0;
for(const[engFile,_,baseIdx,eps]of engines){const e=require('./'+engFile);const fns=e.funcs();for(let i=0;i<eps.length;i++){const bodyIdx=baseIdx+i;let body;try{body=JSON.parse(require('fs').readFileSync(`C:/tmp/ps_body_${bodyIdx}.json`,'utf8'))}catch(err){console.log(`SKIP ${engFile}.${eps[i]}`);continue}try{fns[eps[i]](body);console.log(`OK  ${engFile}.${eps[i]}`);passed++}catch(err){console.log(`FAIL ${engFile}.${eps[i]} (body ${bodyIdx}): ${err.message}`);failed++}}}
console.log(`\nEngine self-test: PASS=${passed} FAIL=${failed}`);
process.exit(failed>0?1:0);
