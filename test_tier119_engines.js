// filepath: test_tier119_engines.js
const fs = require('fs');
const engines = [
  ['tier119_bed_management_624_engine', ['bed_assignment','bed_transfer','bed_cleaning','bed_status_update','capacity_dashboard']],
  ['tier119_transport_625_engine', ['transport_request','transport_completion','courier_service','equipment_transport','transport_dispatch']],
  ['tier119_housekeeping_626_engine', ['room_cleaning','linen_request','waste_disposal','pest_control','maintenance_request']],
  ['tier119_security_627_engine', ['incident_report','visitor_management','access_control_log','surveillance_alert','code_silver']]
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