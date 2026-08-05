// pcc_neuro_ext139_engine tests v3.316.49 (Phase 2 Batch 16 clinical-grade)
const Engine = require('./pcc_neuro_ext139_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext139 engine tests v3.316.49:');
it('HemophiliaExt: severe -> urgent specialist', () => {
  const r = Engine.HemophiliaExt({ HemophiliaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HemophiliaExt: minimal -> lifestyle', () => {
  const r = Engine.HemophiliaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HemophiliaExt: AKI -> dose adjustment', () => {
  const r = Engine.HemophiliaExt({ HemophiliaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('VonWillebrandExt: severe -> urgent specialist', () => {
  const r = Engine.VonWillebrandExt({ VonWillebrandExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('VonWillebrandExt: minimal -> lifestyle', () => {
  const r = Engine.VonWillebrandExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('VonWillebrandExt: AKI -> dose adjustment', () => {
  const r = Engine.VonWillebrandExt({ VonWillebrandExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ImmuneThrombocytopeniaExt: severe -> urgent specialist', () => {
  const r = Engine.ImmuneThrombocytopeniaExt({ ImmuneThrombocytopeniaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ImmuneThrombocytopeniaExt: minimal -> lifestyle', () => {
  const r = Engine.ImmuneThrombocytopeniaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ImmuneThrombocytopeniaExt: AKI -> dose adjustment', () => {
  const r = Engine.ImmuneThrombocytopeniaExt({ ImmuneThrombocytopeniaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AcquiredHemophiliaExt: severe -> urgent specialist', () => {
  const r = Engine.AcquiredHemophiliaExt({ AcquiredHemophiliaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AcquiredHemophiliaExt: minimal -> lifestyle', () => {
  const r = Engine.AcquiredHemophiliaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AcquiredHemophiliaExt: AKI -> dose adjustment', () => {
  const r = Engine.AcquiredHemophiliaExt({ AcquiredHemophiliaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DICSecondaryExt: severe -> urgent specialist', () => {
  const r = Engine.DICSecondaryExt({ DICSecondaryExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DICSecondaryExt: minimal -> lifestyle', () => {
  const r = Engine.DICSecondaryExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DICSecondaryExt: AKI -> dose adjustment', () => {
  const r = Engine.DICSecondaryExt({ DICSecondaryExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ThromboticMicroangiopathyExt: severe -> urgent specialist', () => {
  const r = Engine.ThromboticMicroangiopathyExt({ ThromboticMicroangiopathyExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ThromboticMicroangiopathyExt: minimal -> lifestyle', () => {
  const r = Engine.ThromboticMicroangiopathyExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ThromboticMicroangiopathyExt: AKI -> dose adjustment', () => {
  const r = Engine.ThromboticMicroangiopathyExt({ ThromboticMicroangiopathyExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HypercoagulableStateExt: severe -> urgent specialist', () => {
  const r = Engine.HypercoagulableStateExt({ HypercoagulableStateExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HypercoagulableStateExt: minimal -> lifestyle', () => {
  const r = Engine.HypercoagulableStateExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HypercoagulableStateExt: AKI -> dose adjustment', () => {
  const r = Engine.HypercoagulableStateExt({ HypercoagulableStateExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AntiphospholipidSynExt: severe -> urgent specialist', () => {
  const r = Engine.AntiphospholipidSynExt({ AntiphospholipidSynExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AntiphospholipidSynExt: minimal -> lifestyle', () => {
  const r = Engine.AntiphospholipidSynExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AntiphospholipidSynExt: AKI -> dose adjustment', () => {
  const r = Engine.AntiphospholipidSynExt({ AntiphospholipidSynExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ThrombophiliaInheritedExt: severe -> urgent specialist', () => {
  const r = Engine.ThrombophiliaInheritedExt({ ThrombophiliaInheritedExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ThrombophiliaInheritedExt: minimal -> lifestyle', () => {
  const r = Engine.ThrombophiliaInheritedExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ThrombophiliaInheritedExt: AKI -> dose adjustment', () => {
  const r = Engine.ThrombophiliaInheritedExt({ ThrombophiliaInheritedExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AnticoagulationReversalExt: severe -> urgent specialist', () => {
  const r = Engine.AnticoagulationReversalExt({ AnticoagulationReversalExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AnticoagulationReversalExt: minimal -> lifestyle', () => {
  const r = Engine.AnticoagulationReversalExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AnticoagulationReversalExt: AKI -> dose adjustment', () => {
  const r = Engine.AnticoagulationReversalExt({ AnticoagulationReversalExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
