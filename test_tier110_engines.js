// filepath: test_tier110_engines.js
const fs = require('fs');
const engines = [
  ['tier110_pharmacy_clinical_580_engine', ['order_review','renal_dosing','hepatic_dosing','therapeutic_drug_monitoring','iv_to_po_conversion']],
  ['tier110_antimicrobial_stewardship_581_engine', ['culture_review','antibiotic_choice','duration_assessment','iv_to_po_switch','resistance_pattern']],
  ['tier110_chemotherapy_pharmacy_582_engine', ['regimen_protocol','dose_calculation','premedication','toxicity_monitoring','cycle_assessment']],
  ['tier110_adverse_drug_reaction_583_engine', ['reaction_reporting','causality_assessment','severity_grading','allergy_labeling','reporting_to_fda']],
  ['tier110_medication_safety_584_engine', ['high_alert_medication','look_alike_sound_alike','double_check','cis','smart_pump']]
];
let pass = 0, fail = 0, bodyIdx = 0;
for (const [engName, fns] of engines) {
  const e = require('./' + engName);
  const f = e.funcs();
  for (const fn of fns) {
    const body = JSON.parse(fs.readFileSync(`C:\\tmp\\multi_body_${bodyIdx}.json`, 'utf8'));
    try {
      f[fn](body);
      console.log(`PASS ${engName}.${fn} (body ${bodyIdx})`);
      pass++;
    } catch (err) {
      console.log(`FAIL ${engName}.${fn} (body ${bodyIdx}): ${err.message}`);
      fail++;
    }
    bodyIdx++;
  }
}
console.log(`Engine self-test: PASS=${pass} FAIL=${fail}`);
process.exit(fail > 0 ? 1 : 0);