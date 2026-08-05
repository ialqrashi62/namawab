// pcc_neuro_ext196_engine tests v3.316.53 (Phase 2 Batch 20 clinical-grade)
const Engine = require('./pcc_neuro_ext196_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext196 engine tests v3.316.53:');
it('DementiaAlzheimerAdultExt: severe -> urgent specialist', () => {
  const r = Engine.DementiaAlzheimerAdultExt({ DementiaAlzheimerAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DementiaAlzheimerAdultExt: minimal -> lifestyle', () => {
  const r = Engine.DementiaAlzheimerAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DementiaAlzheimerAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.DementiaAlzheimerAdultExt({ DementiaAlzheimerAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('VascularDementiaAdultExt: severe -> urgent specialist', () => {
  const r = Engine.VascularDementiaAdultExt({ VascularDementiaAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('VascularDementiaAdultExt: minimal -> lifestyle', () => {
  const r = Engine.VascularDementiaAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('VascularDementiaAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.VascularDementiaAdultExt({ VascularDementiaAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('LewyBodyAdultExt: severe -> urgent specialist', () => {
  const r = Engine.LewyBodyAdultExt({ LewyBodyAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('LewyBodyAdultExt: minimal -> lifestyle', () => {
  const r = Engine.LewyBodyAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('LewyBodyAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.LewyBodyAdultExt({ LewyBodyAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('FTDadultExt: severe -> urgent specialist', () => {
  const r = Engine.FTDadultExt({ FTDadultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('FTDadultExt: minimal -> lifestyle', () => {
  const r = Engine.FTDadultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('FTDadultExt: AKI -> dose adjustment', () => {
  const r = Engine.FTDadultExt({ FTDadultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MCIadultExt: severe -> urgent specialist', () => {
  const r = Engine.MCIadultExt({ MCIadultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MCIadultExt: minimal -> lifestyle', () => {
  const r = Engine.MCIadultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MCIadultExt: AKI -> dose adjustment', () => {
  const r = Engine.MCIadultExt({ MCIadultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PosteriorCorticalAdultExt: severe -> urgent specialist', () => {
  const r = Engine.PosteriorCorticalAdultExt({ PosteriorCorticalAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PosteriorCorticalAdultExt: minimal -> lifestyle', () => {
  const r = Engine.PosteriorCorticalAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PosteriorCorticalAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.PosteriorCorticalAdultExt({ PosteriorCorticalAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('NPHadultExt: severe -> urgent specialist', () => {
  const r = Engine.NPHadultExt({ NPHadultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('NPHadultExt: minimal -> lifestyle', () => {
  const r = Engine.NPHadultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('NPHadultExt: AKI -> dose adjustment', () => {
  const r = Engine.NPHadultExt({ NPHadultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AutoimmuneEncephalitisExt: severe -> urgent specialist', () => {
  const r = Engine.AutoimmuneEncephalitisExt({ AutoimmuneEncephalitisExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AutoimmuneEncephalitisExt: minimal -> lifestyle', () => {
  const r = Engine.AutoimmuneEncephalitisExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AutoimmuneEncephalitisExt: AKI -> dose adjustment', () => {
  const r = Engine.AutoimmuneEncephalitisExt({ AutoimmuneEncephalitisExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CJDadultExt: severe -> urgent specialist', () => {
  const r = Engine.CJDadultExt({ CJDadultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CJDadultExt: minimal -> lifestyle', () => {
  const r = Engine.CJDadultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CJDadultExt: AKI -> dose adjustment', () => {
  const r = Engine.CJDadultExt({ CJDadultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DeliriumAdultExt: severe -> urgent specialist', () => {
  const r = Engine.DeliriumAdultExt({ DeliriumAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DeliriumAdultExt: minimal -> lifestyle', () => {
  const r = Engine.DeliriumAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DeliriumAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.DeliriumAdultExt({ DeliriumAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
