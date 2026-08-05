// pcc_neuro_ext107_engine tests v3.316.46 (Phase 2 Batch 13 clinical-grade)
const Engine = require('./pcc_neuro_ext107_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext107 engine tests v3.316.46:');
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
it('SubarachnoidHemorrhageExt: severe -> urgent specialist', () => {
  const r = Engine.SubarachnoidHemorrhageExt({ SubarachnoidHemorrhageExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SubarachnoidHemorrhageExt: minimal -> lifestyle', () => {
  const r = Engine.SubarachnoidHemorrhageExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SubarachnoidHemorrhageExt: AKI -> dose adjustment', () => {
  const r = Engine.SubarachnoidHemorrhageExt({ SubarachnoidHemorrhageExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AVMalformationExt: severe -> urgent specialist', () => {
  const r = Engine.AVMalformationExt({ AVMalformationExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AVMalformationExt: minimal -> lifestyle', () => {
  const r = Engine.AVMalformationExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AVMalformationExt: AKI -> dose adjustment', () => {
  const r = Engine.AVMalformationExt({ AVMalformationExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CavernomaExt: severe -> urgent specialist', () => {
  const r = Engine.CavernomaExt({ CavernomaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CavernomaExt: minimal -> lifestyle', () => {
  const r = Engine.CavernomaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CavernomaExt: AKI -> dose adjustment', () => {
  const r = Engine.CavernomaExt({ CavernomaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CerebralVenousMalformationExt: severe -> urgent specialist', () => {
  const r = Engine.CerebralVenousMalformationExt({ CerebralVenousMalformationExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CerebralVenousMalformationExt: minimal -> lifestyle', () => {
  const r = Engine.CerebralVenousMalformationExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CerebralVenousMalformationExt: AKI -> dose adjustment', () => {
  const r = Engine.CerebralVenousMalformationExt({ CerebralVenousMalformationExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DuralAVFistulaExt: severe -> urgent specialist', () => {
  const r = Engine.DuralAVFistulaExt({ DuralAVFistulaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DuralAVFistulaExt: minimal -> lifestyle', () => {
  const r = Engine.DuralAVFistulaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DuralAVFistulaExt: AKI -> dose adjustment', () => {
  const r = Engine.DuralAVFistulaExt({ DuralAVFistulaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CarotidCavernousFistulaExt: severe -> urgent specialist', () => {
  const r = Engine.CarotidCavernousFistulaExt({ CarotidCavernousFistulaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CarotidCavernousFistulaExt: minimal -> lifestyle', () => {
  const r = Engine.CarotidCavernousFistulaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CarotidCavernousFistulaExt: AKI -> dose adjustment', () => {
  const r = Engine.CarotidCavernousFistulaExt({ CarotidCavernousFistulaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PICAneurysmExt: severe -> urgent specialist', () => {
  const r = Engine.PICAneurysmExt({ PICAneurysmExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PICAneurysmExt: minimal -> lifestyle', () => {
  const r = Engine.PICAneurysmExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PICAneurysmExt: AKI -> dose adjustment', () => {
  const r = Engine.PICAneurysmExt({ PICAneurysmExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('BasilarAneurysmExt: severe -> urgent specialist', () => {
  const r = Engine.BasilarAneurysmExt({ BasilarAneurysmExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('BasilarAneurysmExt: minimal -> lifestyle', () => {
  const r = Engine.BasilarAneurysmExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('BasilarAneurysmExt: AKI -> dose adjustment', () => {
  const r = Engine.BasilarAneurysmExt({ BasilarAneurysmExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('GiantAneurysmExt: severe -> urgent specialist', () => {
  const r = Engine.GiantAneurysmExt({ GiantAneurysmExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('GiantAneurysmExt: minimal -> lifestyle', () => {
  const r = Engine.GiantAneurysmExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('GiantAneurysmExt: AKI -> dose adjustment', () => {
  const r = Engine.GiantAneurysmExt({ GiantAneurysmExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
