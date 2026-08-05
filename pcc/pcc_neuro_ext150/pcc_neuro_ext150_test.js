// pcc_neuro_ext150_engine tests v3.316.49 (Phase 2 Batch 16 clinical-grade)
const Engine = require('./pcc_neuro_ext150_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext150 engine tests v3.316.49:');
it('CerebralAneurysmExt: severe -> urgent specialist', () => {
  const r = Engine.CerebralAneurysmExt({ CerebralAneurysmExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CerebralAneurysmExt: minimal -> lifestyle', () => {
  const r = Engine.CerebralAneurysmExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CerebralAneurysmExt: AKI -> dose adjustment', () => {
  const r = Engine.CerebralAneurysmExt({ CerebralAneurysmExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AVMExt: severe -> urgent specialist', () => {
  const r = Engine.AVMExt({ AVMExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AVMExt: minimal -> lifestyle', () => {
  const r = Engine.AVMExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AVMExt: AKI -> dose adjustment', () => {
  const r = Engine.AVMExt({ AVMExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CavernousMalformationExt: severe -> urgent specialist', () => {
  const r = Engine.CavernousMalformationExt({ CavernousMalformationExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CavernousMalformationExt: minimal -> lifestyle', () => {
  const r = Engine.CavernousMalformationExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CavernousMalformationExt: AKI -> dose adjustment', () => {
  const r = Engine.CavernousMalformationExt({ CavernousMalformationExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DuralAVFExt: severe -> urgent specialist', () => {
  const r = Engine.DuralAVFExt({ DuralAVFExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DuralAVFExt: minimal -> lifestyle', () => {
  const r = Engine.DuralAVFExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DuralAVFExt: AKI -> dose adjustment', () => {
  const r = Engine.DuralAVFExt({ DuralAVFExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MoyamoyaExt: severe -> urgent specialist', () => {
  const r = Engine.MoyamoyaExt({ MoyamoyaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MoyamoyaExt: minimal -> lifestyle', () => {
  const r = Engine.MoyamoyaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MoyamoyaExt: AKI -> dose adjustment', () => {
  const r = Engine.MoyamoyaExt({ MoyamoyaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CarotidDissectionExt: severe -> urgent specialist', () => {
  const r = Engine.CarotidDissectionExt({ CarotidDissectionExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CarotidDissectionExt: minimal -> lifestyle', () => {
  const r = Engine.CarotidDissectionExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CarotidDissectionExt: AKI -> dose adjustment', () => {
  const r = Engine.CarotidDissectionExt({ CarotidDissectionExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('VertebralDissectionExt: severe -> urgent specialist', () => {
  const r = Engine.VertebralDissectionExt({ VertebralDissectionExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('VertebralDissectionExt: minimal -> lifestyle', () => {
  const r = Engine.VertebralDissectionExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('VertebralDissectionExt: AKI -> dose adjustment', () => {
  const r = Engine.VertebralDissectionExt({ VertebralDissectionExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CerebralVenousThrombExt: severe -> urgent specialist', () => {
  const r = Engine.CerebralVenousThrombExt({ CerebralVenousThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CerebralVenousThrombExt: minimal -> lifestyle', () => {
  const r = Engine.CerebralVenousThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CerebralVenousThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.CerebralVenousThrombExt({ CerebralVenousThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('RCVSext: severe -> urgent specialist', () => {
  const r = Engine.RCVSext({ RCVSext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('RCVSext: minimal -> lifestyle', () => {
  const r = Engine.RCVSext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('RCVSext: AKI -> dose adjustment', () => {
  const r = Engine.RCVSext({ RCVSext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PRESext: severe -> urgent specialist', () => {
  const r = Engine.PRESext({ PRESext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PRESext: minimal -> lifestyle', () => {
  const r = Engine.PRESext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PRESext: AKI -> dose adjustment', () => {
  const r = Engine.PRESext({ PRESext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
