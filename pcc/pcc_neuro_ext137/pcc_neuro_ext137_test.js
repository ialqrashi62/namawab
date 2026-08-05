// pcc_neuro_ext137_engine tests v3.316.48 (Phase 2 Batch 15 clinical-grade)
const Engine = require('./pcc_neuro_ext137_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext137 engine tests v3.316.48:');
it('CerebralAngiitisExt: severe -> urgent specialist', () => {
  const r = Engine.CerebralAngiitisExt({ CerebralAngiitisExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CerebralAngiitisExt: minimal -> lifestyle', () => {
  const r = Engine.CerebralAngiitisExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CerebralAngiitisExt: AKI -> dose adjustment', () => {
  const r = Engine.CerebralAngiitisExt({ CerebralAngiitisExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PACNSext: severe -> urgent specialist', () => {
  const r = Engine.PACNSext({ PACNSext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PACNSext: minimal -> lifestyle', () => {
  const r = Engine.PACNSext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PACNSext: AKI -> dose adjustment', () => {
  const r = Engine.PACNSext({ PACNSext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CNSVExt: severe -> urgent specialist', () => {
  const r = Engine.CNSVExt({ CNSVExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CNSVExt: minimal -> lifestyle', () => {
  const r = Engine.CNSVExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CNSVExt: AKI -> dose adjustment', () => {
  const r = Engine.CNSVExt({ CNSVExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ReversibleVasoconstExt: severe -> urgent specialist', () => {
  const r = Engine.ReversibleVasoconstExt({ ReversibleVasoconstExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ReversibleVasoconstExt: minimal -> lifestyle', () => {
  const r = Engine.ReversibleVasoconstExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ReversibleVasoconstExt: AKI -> dose adjustment', () => {
  const r = Engine.ReversibleVasoconstExt({ ReversibleVasoconstExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CallFlemingExt: severe -> urgent specialist', () => {
  const r = Engine.CallFlemingExt({ CallFlemingExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CallFlemingExt: minimal -> lifestyle', () => {
  const r = Engine.CallFlemingExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CallFlemingExt: AKI -> dose adjustment', () => {
  const r = Engine.CallFlemingExt({ CallFlemingExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SusacSyndromeExt: severe -> urgent specialist', () => {
  const r = Engine.SusacSyndromeExt({ SusacSyndromeExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SusacSyndromeExt: minimal -> lifestyle', () => {
  const r = Engine.SusacSyndromeExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SusacSyndromeExt: AKI -> dose adjustment', () => {
  const r = Engine.SusacSyndromeExt({ SusacSyndromeExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CADASILwithStrokeExt: severe -> urgent specialist', () => {
  const r = Engine.CADASILwithStrokeExt({ CADASILwithStrokeExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CADASILwithStrokeExt: minimal -> lifestyle', () => {
  const r = Engine.CADASILwithStrokeExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CADASILwithStrokeExt: AKI -> dose adjustment', () => {
  const r = Engine.CADASILwithStrokeExt({ CADASILwithStrokeExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HeparinInducedThrombExt: severe -> urgent specialist', () => {
  const r = Engine.HeparinInducedThrombExt({ HeparinInducedThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeparinInducedThrombExt: minimal -> lifestyle', () => {
  const r = Engine.HeparinInducedThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeparinInducedThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.HeparinInducedThrombExt({ HeparinInducedThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DICext: severe -> urgent specialist', () => {
  const r = Engine.DICext({ DICext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DICext: minimal -> lifestyle', () => {
  const r = Engine.DICext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DICext: AKI -> dose adjustment', () => {
  const r = Engine.DICext({ DICext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('TTPext: severe -> urgent specialist', () => {
  const r = Engine.TTPext({ TTPext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TTPext: minimal -> lifestyle', () => {
  const r = Engine.TTPext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TTPext: AKI -> dose adjustment', () => {
  const r = Engine.TTPext({ TTPext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
