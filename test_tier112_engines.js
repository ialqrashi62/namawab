// filepath: test_tier112_engines.js
const fs = require('fs');
const engines = [
  ['tier112_infection_control_590_engine', ['hai_surveillance','isolation_precautions','catheter_bundle','ssi_prevention','hand_hygiene_compliance']],
  ['tier112_pathogen_tracking_591_engine', ['outbreak_detection','whole_genome_sequencing','contact_tracing','environmental_sampling','line_listing']],
  ['tier112_immunization_592_engine', ['vaccination_schedule','vaccine_administration','contraindication_screening','titer_checking','travel_vaccination']],
  ['tier112_sterilization_593_engine', ['sterilization_validation','biological_indicator','chemical_indicator','sterilization_failure','scope_reprocessing']],
  ['tier112_stew_extended_594_engine', ['local_antibiogram','antibiotic_d_drug_specific','resistance_trend','intervention_metrics','antibiogram_alert']]
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