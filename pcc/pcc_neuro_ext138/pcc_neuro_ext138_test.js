// pcc_neuro_ext138_engine tests v3.316.48 (Phase 2 Batch 15 clinical-grade)
const Engine = require('./pcc_neuro_ext138_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext138 engine tests v3.316.48:');
it('SCDext: severe -> urgent specialist', () => {
  const r = Engine.SCDext({ SCDext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SCDext: minimal -> lifestyle', () => {
  const r = Engine.SCDext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SCDext: AKI -> dose adjustment', () => {
  const r = Engine.SCDext({ SCDext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SCDPainCrisisExt: severe -> urgent specialist', () => {
  const r = Engine.SCDPainCrisisExt({ SCDPainCrisisExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SCDPainCrisisExt: minimal -> lifestyle', () => {
  const r = Engine.SCDPainCrisisExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SCDPainCrisisExt: AKI -> dose adjustment', () => {
  const r = Engine.SCDPainCrisisExt({ SCDPainCrisisExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SCDStrokeExt: severe -> urgent specialist', () => {
  const r = Engine.SCDStrokeExt({ SCDStrokeExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SCDStrokeExt: minimal -> lifestyle', () => {
  const r = Engine.SCDStrokeExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SCDStrokeExt: AKI -> dose adjustment', () => {
  const r = Engine.SCDStrokeExt({ SCDStrokeExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SCDAcuteChestExt: severe -> urgent specialist', () => {
  const r = Engine.SCDAcuteChestExt({ SCDAcuteChestExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SCDAcuteChestExt: minimal -> lifestyle', () => {
  const r = Engine.SCDAcuteChestExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SCDAcuteChestExt: AKI -> dose adjustment', () => {
  const r = Engine.SCDAcuteChestExt({ SCDAcuteChestExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SCDPriapismExt: severe -> urgent specialist', () => {
  const r = Engine.SCDPriapismExt({ SCDPriapismExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SCDPriapismExt: minimal -> lifestyle', () => {
  const r = Engine.SCDPriapismExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SCDPriapismExt: AKI -> dose adjustment', () => {
  const r = Engine.SCDPriapismExt({ SCDPriapismExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SCDRenalExt: severe -> urgent specialist', () => {
  const r = Engine.SCDRenalExt({ SCDRenalExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SCDRenalExt: minimal -> lifestyle', () => {
  const r = Engine.SCDRenalExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SCDRenalExt: AKI -> dose adjustment', () => {
  const r = Engine.SCDRenalExt({ SCDRenalExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SCDRetinopathyExt: severe -> urgent specialist', () => {
  const r = Engine.SCDRetinopathyExt({ SCDRetinopathyExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SCDRetinopathyExt: minimal -> lifestyle', () => {
  const r = Engine.SCDRetinopathyExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SCDRetinopathyExt: AKI -> dose adjustment', () => {
  const r = Engine.SCDRetinopathyExt({ SCDRetinopathyExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SCDAvNExt: severe -> urgent specialist', () => {
  const r = Engine.SCDAvNExt({ SCDAvNExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SCDAvNExt: minimal -> lifestyle', () => {
  const r = Engine.SCDAvNExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SCDAvNExt: AKI -> dose adjustment', () => {
  const r = Engine.SCDAvNExt({ SCDAvNExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SCDLegUlcerExt: severe -> urgent specialist', () => {
  const r = Engine.SCDLegUlcerExt({ SCDLegUlcerExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SCDLegUlcerExt: minimal -> lifestyle', () => {
  const r = Engine.SCDLegUlcerExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SCDLegUlcerExt: AKI -> dose adjustment', () => {
  const r = Engine.SCDLegUlcerExt({ SCDLegUlcerExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SCDHydroxyureaExt: severe -> urgent specialist', () => {
  const r = Engine.SCDHydroxyureaExt({ SCDHydroxyureaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SCDHydroxyureaExt: minimal -> lifestyle', () => {
  const r = Engine.SCDHydroxyureaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SCDHydroxyureaExt: AKI -> dose adjustment', () => {
  const r = Engine.SCDHydroxyureaExt({ SCDHydroxyureaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
