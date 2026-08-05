// pcc_neuro_ext194_engine tests v3.316.53 (Phase 2 Batch 20 clinical-grade)
const Engine = require('./pcc_neuro_ext194_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext194 engine tests v3.316.53:');
it('HeadacheMigraineAdultExt: severe -> urgent specialist', () => {
  const r = Engine.HeadacheMigraineAdultExt({ HeadacheMigraineAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadacheMigraineAdultExt: minimal -> lifestyle', () => {
  const r = Engine.HeadacheMigraineAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadacheMigraineAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadacheMigraineAdultExt({ HeadacheMigraineAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HeadacheClusterAdultExt: severe -> urgent specialist', () => {
  const r = Engine.HeadacheClusterAdultExt({ HeadacheClusterAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadacheClusterAdultExt: minimal -> lifestyle', () => {
  const r = Engine.HeadacheClusterAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadacheClusterAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadacheClusterAdultExt({ HeadacheClusterAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HeadacheTensionAdultExt: severe -> urgent specialist', () => {
  const r = Engine.HeadacheTensionAdultExt({ HeadacheTensionAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadacheTensionAdultExt: minimal -> lifestyle', () => {
  const r = Engine.HeadacheTensionAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadacheTensionAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadacheTensionAdultExt({ HeadacheTensionAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HeadacheMedicationOveruseExt: severe -> urgent specialist', () => {
  const r = Engine.HeadacheMedicationOveruseExt({ HeadacheMedicationOveruseExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadacheMedicationOveruseExt: minimal -> lifestyle', () => {
  const r = Engine.HeadacheMedicationOveruseExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadacheMedicationOveruseExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadacheMedicationOveruseExt({ HeadacheMedicationOveruseExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HeadachePregnancyExt: severe -> urgent specialist', () => {
  const r = Engine.HeadachePregnancyExt({ HeadachePregnancyExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadachePregnancyExt: minimal -> lifestyle', () => {
  const r = Engine.HeadachePregnancyExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadachePregnancyExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadachePregnancyExt({ HeadachePregnancyExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HeadacheThunderclapExt: severe -> urgent specialist', () => {
  const r = Engine.HeadacheThunderclapExt({ HeadacheThunderclapExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadacheThunderclapExt: minimal -> lifestyle', () => {
  const r = Engine.HeadacheThunderclapExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadacheThunderclapExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadacheThunderclapExt({ HeadacheThunderclapExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HeadacheIdiopathicIntracranialExt: severe -> urgent specialist', () => {
  const r = Engine.HeadacheIdiopathicIntracranialExt({ HeadacheIdiopathicIntracranialExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadacheIdiopathicIntracranialExt: minimal -> lifestyle', () => {
  const r = Engine.HeadacheIdiopathicIntracranialExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadacheIdiopathicIntracranialExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadacheIdiopathicIntracranialExt({ HeadacheIdiopathicIntracranialExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HeadacheLowCSFExt: severe -> urgent specialist', () => {
  const r = Engine.HeadacheLowCSFExt({ HeadacheLowCSFExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadacheLowCSFExt: minimal -> lifestyle', () => {
  const r = Engine.HeadacheLowCSFExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadacheLowCSFExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadacheLowCSFExt({ HeadacheLowCSFExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HeadacheTrigeminalExt: severe -> urgent specialist', () => {
  const r = Engine.HeadacheTrigeminalExt({ HeadacheTrigeminalExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadacheTrigeminalExt: minimal -> lifestyle', () => {
  const r = Engine.HeadacheTrigeminalExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadacheTrigeminalExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadacheTrigeminalExt({ HeadacheTrigeminalExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HeadacheCervicogenicExt: severe -> urgent specialist', () => {
  const r = Engine.HeadacheCervicogenicExt({ HeadacheCervicogenicExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadacheCervicogenicExt: minimal -> lifestyle', () => {
  const r = Engine.HeadacheCervicogenicExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadacheCervicogenicExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadacheCervicogenicExt({ HeadacheCervicogenicExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
