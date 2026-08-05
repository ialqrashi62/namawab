// pcc_neuro_ext97_engine tests v3.316.54 (Phase 2 Batch 21 clinical-grade)
const Engine = require('./pcc_neuro_ext97_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext97 engine tests v3.316.54:');
it('HeadacheClinicExt: severe -> urgent specialist', () => {
  const r = Engine.HeadacheClinicExt({ HeadacheClinicExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadacheClinicExt: minimal -> lifestyle', () => {
  const r = Engine.HeadacheClinicExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadacheClinicExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadacheClinicExt({ HeadacheClinicExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MigraineProphyExt: severe -> urgent specialist', () => {
  const r = Engine.MigraineProphyExt({ MigraineProphyExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MigraineProphyExt: minimal -> lifestyle', () => {
  const r = Engine.MigraineProphyExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MigraineProphyExt: AKI -> dose adjustment', () => {
  const r = Engine.MigraineProphyExt({ MigraineProphyExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('BotoxChronicMigraineExt: severe -> urgent specialist', () => {
  const r = Engine.BotoxChronicMigraineExt({ BotoxChronicMigraineExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('BotoxChronicMigraineExt: minimal -> lifestyle', () => {
  const r = Engine.BotoxChronicMigraineExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('BotoxChronicMigraineExt: AKI -> dose adjustment', () => {
  const r = Engine.BotoxChronicMigraineExt({ BotoxChronicMigraineExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CGRPAntagonistExt: severe -> urgent specialist', () => {
  const r = Engine.CGRPAntagonistExt({ CGRPAntagonistExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CGRPAntagonistExt: minimal -> lifestyle', () => {
  const r = Engine.CGRPAntagonistExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CGRPAntagonistExt: AKI -> dose adjustment', () => {
  const r = Engine.CGRPAntagonistExt({ CGRPAntagonistExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ClusterHeadacheAcuteExt: severe -> urgent specialist', () => {
  const r = Engine.ClusterHeadacheAcuteExt({ ClusterHeadacheAcuteExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ClusterHeadacheAcuteExt: minimal -> lifestyle', () => {
  const r = Engine.ClusterHeadacheAcuteExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ClusterHeadacheAcuteExt: AKI -> dose adjustment', () => {
  const r = Engine.ClusterHeadacheAcuteExt({ ClusterHeadacheAcuteExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('TensionHeadacheMgmExt: severe -> urgent specialist', () => {
  const r = Engine.TensionHeadacheMgmExt({ TensionHeadacheMgmExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TensionHeadacheMgmExt: minimal -> lifestyle', () => {
  const r = Engine.TensionHeadacheMgmExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TensionHeadacheMgmExt: AKI -> dose adjustment', () => {
  const r = Engine.TensionHeadacheMgmExt({ TensionHeadacheMgmExt: 2, egfr: 25 });
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
it('LowCSFPressureExt: severe -> urgent specialist', () => {
  const r = Engine.LowCSFPressureExt({ LowCSFPressureExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('LowCSFPressureExt: minimal -> lifestyle', () => {
  const r = Engine.LowCSFPressureExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('LowCSFPressureExt: AKI -> dose adjustment', () => {
  const r = Engine.LowCSFPressureExt({ LowCSFPressureExt: 2, egfr: 25 });
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
