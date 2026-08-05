// pcc_neuro_ext163_engine tests v3.316.51 (Phase 2 Batch 18 clinical-grade)
const Engine = require('./pcc_neuro_ext163_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext163 engine tests v3.316.51:');
it('DementiaAlzExt: severe -> urgent specialist', () => {
  const r = Engine.DementiaAlzExt({ DementiaAlzExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DementiaAlzExt: minimal -> lifestyle', () => {
  const r = Engine.DementiaAlzExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DementiaAlzExt: AKI -> dose adjustment', () => {
  const r = Engine.DementiaAlzExt({ DementiaAlzExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DementiaVascularExt: severe -> urgent specialist', () => {
  const r = Engine.DementiaVascularExt({ DementiaVascularExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DementiaVascularExt: minimal -> lifestyle', () => {
  const r = Engine.DementiaVascularExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DementiaVascularExt: AKI -> dose adjustment', () => {
  const r = Engine.DementiaVascularExt({ DementiaVascularExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DementiaLewyExt: severe -> urgent specialist', () => {
  const r = Engine.DementiaLewyExt({ DementiaLewyExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DementiaLewyExt: minimal -> lifestyle', () => {
  const r = Engine.DementiaLewyExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DementiaLewyExt: AKI -> dose adjustment', () => {
  const r = Engine.DementiaLewyExt({ DementiaLewyExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DementiaFrontotemporalExt: severe -> urgent specialist', () => {
  const r = Engine.DementiaFrontotemporalExt({ DementiaFrontotemporalExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DementiaFrontotemporalExt: minimal -> lifestyle', () => {
  const r = Engine.DementiaFrontotemporalExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DementiaFrontotemporalExt: AKI -> dose adjustment', () => {
  const r = Engine.DementiaFrontotemporalExt({ DementiaFrontotemporalExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ParkinsonDementiaExt: severe -> urgent specialist', () => {
  const r = Engine.ParkinsonDementiaExt({ ParkinsonDementiaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ParkinsonDementiaExt: minimal -> lifestyle', () => {
  const r = Engine.ParkinsonDementiaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ParkinsonDementiaExt: AKI -> dose adjustment', () => {
  const r = Engine.ParkinsonDementiaExt({ ParkinsonDementiaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('NormalPressureHydroExt: severe -> urgent specialist', () => {
  const r = Engine.NormalPressureHydroExt({ NormalPressureHydroExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('NormalPressureHydroExt: minimal -> lifestyle', () => {
  const r = Engine.NormalPressureHydroExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('NormalPressureHydroExt: AKI -> dose adjustment', () => {
  const r = Engine.NormalPressureHydroExt({ NormalPressureHydroExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('WernickeExt: severe -> urgent specialist', () => {
  const r = Engine.WernickeExt({ WernickeExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('WernickeExt: minimal -> lifestyle', () => {
  const r = Engine.WernickeExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('WernickeExt: AKI -> dose adjustment', () => {
  const r = Engine.WernickeExt({ WernickeExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CreutzfeldtJakobExt: severe -> urgent specialist', () => {
  const r = Engine.CreutzfeldtJakobExt({ CreutzfeldtJakobExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CreutzfeldtJakobExt: minimal -> lifestyle', () => {
  const r = Engine.CreutzfeldtJakobExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CreutzfeldtJakobExt: AKI -> dose adjustment', () => {
  const r = Engine.CreutzfeldtJakobExt({ CreutzfeldtJakobExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HIVAssociatedExt: severe -> urgent specialist', () => {
  const r = Engine.HIVAssociatedExt({ HIVAssociatedExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HIVAssociatedExt: minimal -> lifestyle', () => {
  const r = Engine.HIVAssociatedExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HIVAssociatedExt: AKI -> dose adjustment', () => {
  const r = Engine.HIVAssociatedExt({ HIVAssociatedExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MildCognitiveExt: severe -> urgent specialist', () => {
  const r = Engine.MildCognitiveExt({ MildCognitiveExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MildCognitiveExt: minimal -> lifestyle', () => {
  const r = Engine.MildCognitiveExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MildCognitiveExt: AKI -> dose adjustment', () => {
  const r = Engine.MildCognitiveExt({ MildCognitiveExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
