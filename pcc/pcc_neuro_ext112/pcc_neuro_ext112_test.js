// pcc_neuro_ext112_engine tests v3.316.46 (Phase 2 Batch 13 clinical-grade)
const Engine = require('./pcc_neuro_ext112_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext112 engine tests v3.316.46:');
it('MigraineExt: severe -> urgent specialist', () => {
  const r = Engine.MigraineExt({ MigraineExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MigraineExt: minimal -> lifestyle', () => {
  const r = Engine.MigraineExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MigraineExt: AKI -> dose adjustment', () => {
  const r = Engine.MigraineExt({ MigraineExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MigraineAuraExt: severe -> urgent specialist', () => {
  const r = Engine.MigraineAuraExt({ MigraineAuraExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MigraineAuraExt: minimal -> lifestyle', () => {
  const r = Engine.MigraineAuraExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MigraineAuraExt: AKI -> dose adjustment', () => {
  const r = Engine.MigraineAuraExt({ MigraineAuraExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ChronicMigraineExt: severe -> urgent specialist', () => {
  const r = Engine.ChronicMigraineExt({ ChronicMigraineExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ChronicMigraineExt: minimal -> lifestyle', () => {
  const r = Engine.ChronicMigraineExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ChronicMigraineExt: AKI -> dose adjustment', () => {
  const r = Engine.ChronicMigraineExt({ ChronicMigraineExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ClusterHeadacheExt: severe -> urgent specialist', () => {
  const r = Engine.ClusterHeadacheExt({ ClusterHeadacheExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ClusterHeadacheExt: minimal -> lifestyle', () => {
  const r = Engine.ClusterHeadacheExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ClusterHeadacheExt: AKI -> dose adjustment', () => {
  const r = Engine.ClusterHeadacheExt({ ClusterHeadacheExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('TensionHeadacheExt: severe -> urgent specialist', () => {
  const r = Engine.TensionHeadacheExt({ TensionHeadacheExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TensionHeadacheExt: minimal -> lifestyle', () => {
  const r = Engine.TensionHeadacheExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TensionHeadacheExt: AKI -> dose adjustment', () => {
  const r = Engine.TensionHeadacheExt({ TensionHeadacheExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('TrigeminalNeuralgiaExt: severe -> urgent specialist', () => {
  const r = Engine.TrigeminalNeuralgiaExt({ TrigeminalNeuralgiaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TrigeminalNeuralgiaExt: minimal -> lifestyle', () => {
  const r = Engine.TrigeminalNeuralgiaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TrigeminalNeuralgiaExt: AKI -> dose adjustment', () => {
  const r = Engine.TrigeminalNeuralgiaExt({ TrigeminalNeuralgiaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('OccipitalNeuralgiaExt: severe -> urgent specialist', () => {
  const r = Engine.OccipitalNeuralgiaExt({ OccipitalNeuralgiaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('OccipitalNeuralgiaExt: minimal -> lifestyle', () => {
  const r = Engine.OccipitalNeuralgiaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('OccipitalNeuralgiaExt: AKI -> dose adjustment', () => {
  const r = Engine.OccipitalNeuralgiaExt({ OccipitalNeuralgiaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('IdiopathicIntracranialHTNExt: severe -> urgent specialist', () => {
  const r = Engine.IdiopathicIntracranialHTNExt({ IdiopathicIntracranialHTNExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('IdiopathicIntracranialHTNExt: minimal -> lifestyle', () => {
  const r = Engine.IdiopathicIntracranialHTNExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('IdiopathicIntracranialHTNExt: AKI -> dose adjustment', () => {
  const r = Engine.IdiopathicIntracranialHTNExt({ IdiopathicIntracranialHTNExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SpontaneousICSExt: severe -> urgent specialist', () => {
  const r = Engine.SpontaneousICSExt({ SpontaneousICSExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SpontaneousICSExt: minimal -> lifestyle', () => {
  const r = Engine.SpontaneousICSExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SpontaneousICSExt: AKI -> dose adjustment', () => {
  const r = Engine.SpontaneousICSExt({ SpontaneousICSExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ReversibleCerebralVasoconstExt: severe -> urgent specialist', () => {
  const r = Engine.ReversibleCerebralVasoconstExt({ ReversibleCerebralVasoconstExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ReversibleCerebralVasoconstExt: minimal -> lifestyle', () => {
  const r = Engine.ReversibleCerebralVasoconstExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ReversibleCerebralVasoconstExt: AKI -> dose adjustment', () => {
  const r = Engine.ReversibleCerebralVasoconstExt({ ReversibleCerebralVasoconstExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
