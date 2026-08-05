// pcc_home_care_ext102_engine tests v3.316.42 (Phase 2 Batch 9 clinical-grade)
const Engine = require('./pcc_home_care_ext102_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_home_care_ext102 engine tests v3.316.42:');
it('HCGenExt: severe -> urgent specialist', () => {
  const r = Engine.HCGenExt({ HCGenExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HCGenExt: minimal -> lifestyle', () => {
  const r = Engine.HCGenExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HCGenExt: AKI -> dose adjustment', () => {
  const r = Engine.HCGenExt({ HCGenExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HCAssessExt: severe -> urgent specialist', () => {
  const r = Engine.HCAssessExt({ HCAssessExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HCAssessExt: minimal -> lifestyle', () => {
  const r = Engine.HCAssessExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HCAssessExt: AKI -> dose adjustment', () => {
  const r = Engine.HCAssessExt({ HCAssessExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HCSkilledExt: severe -> urgent specialist', () => {
  const r = Engine.HCSkilledExt({ HCSkilledExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HCSkilledExt: minimal -> lifestyle', () => {
  const r = Engine.HCSkilledExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HCSkilledExt: AKI -> dose adjustment', () => {
  const r = Engine.HCSkilledExt({ HCSkilledExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HCIVext: severe -> urgent specialist', () => {
  const r = Engine.HCIVext({ HCIVext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HCIVext: minimal -> lifestyle', () => {
  const r = Engine.HCIVext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HCIVext: AKI -> dose adjustment', () => {
  const r = Engine.HCIVext({ HCIVext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HCWoundExt: severe -> urgent specialist', () => {
  const r = Engine.HCWoundExt({ HCWoundExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HCWoundExt: minimal -> lifestyle', () => {
  const r = Engine.HCWoundExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HCWoundExt: AKI -> dose adjustment', () => {
  const r = Engine.HCWoundExt({ HCWoundExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HCPT_ext: severe -> urgent specialist', () => {
  const r = Engine.HCPT_ext({ HCPT_ext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HCPT_ext: minimal -> lifestyle', () => {
  const r = Engine.HCPT_ext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HCPT_ext: AKI -> dose adjustment', () => {
  const r = Engine.HCPT_ext({ HCPT_ext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HCOT_ext: severe -> urgent specialist', () => {
  const r = Engine.HCOT_ext({ HCOT_ext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HCOT_ext: minimal -> lifestyle', () => {
  const r = Engine.HCOT_ext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HCOT_ext: AKI -> dose adjustment', () => {
  const r = Engine.HCOT_ext({ HCOT_ext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HCST_ext: severe -> urgent specialist', () => {
  const r = Engine.HCST_ext({ HCST_ext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HCST_ext: minimal -> lifestyle', () => {
  const r = Engine.HCST_ext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HCST_ext: AKI -> dose adjustment', () => {
  const r = Engine.HCST_ext({ HCST_ext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HCMSWext: severe -> urgent specialist', () => {
  const r = Engine.HCMSWext({ HCMSWext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HCMSWext: minimal -> lifestyle', () => {
  const r = Engine.HCMSWext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HCMSWext: AKI -> dose adjustment', () => {
  const r = Engine.HCMSWext({ HCMSWext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HCAideExt: severe -> urgent specialist', () => {
  const r = Engine.HCAideExt({ HCAideExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HCAideExt: minimal -> lifestyle', () => {
  const r = Engine.HCAideExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HCAideExt: AKI -> dose adjustment', () => {
  const r = Engine.HCAideExt({ HCAideExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
