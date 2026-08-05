// pcc_neuro_ext158_engine tests v3.316.50 (Phase 2 Batch 17 clinical-grade)
const Engine = require('./pcc_neuro_ext158_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext158 engine tests v3.316.50:');
it('AcuteIschemicStrokeExt: severe -> urgent specialist', () => {
  const r = Engine.AcuteIschemicStrokeExt({ AcuteIschemicStrokeExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AcuteIschemicStrokeExt: minimal -> lifestyle', () => {
  const r = Engine.AcuteIschemicStrokeExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AcuteIschemicStrokeExt: AKI -> dose adjustment', () => {
  const r = Engine.AcuteIschemicStrokeExt({ AcuteIschemicStrokeExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('IntracerebralHemorrhageExt: severe -> urgent specialist', () => {
  const r = Engine.IntracerebralHemorrhageExt({ IntracerebralHemorrhageExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('IntracerebralHemorrhageExt: minimal -> lifestyle', () => {
  const r = Engine.IntracerebralHemorrhageExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('IntracerebralHemorrhageExt: AKI -> dose adjustment', () => {
  const r = Engine.IntracerebralHemorrhageExt({ IntracerebralHemorrhageExt: 2, egfr: 25 });
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
it('TIAext: severe -> urgent specialist', () => {
  const r = Engine.TIAext({ TIAext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TIAext: minimal -> lifestyle', () => {
  const r = Engine.TIAext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TIAext: AKI -> dose adjustment', () => {
  const r = Engine.TIAext({ TIAext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('StrokeSecondaryPreventionExt: severe -> urgent specialist', () => {
  const r = Engine.StrokeSecondaryPreventionExt({ StrokeSecondaryPreventionExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('StrokeSecondaryPreventionExt: minimal -> lifestyle', () => {
  const r = Engine.StrokeSecondaryPreventionExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('StrokeSecondaryPreventionExt: AKI -> dose adjustment', () => {
  const r = Engine.StrokeSecondaryPreventionExt({ StrokeSecondaryPreventionExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CryptogenicStrokeExt: severe -> urgent specialist', () => {
  const r = Engine.CryptogenicStrokeExt({ CryptogenicStrokeExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CryptogenicStrokeExt: minimal -> lifestyle', () => {
  const r = Engine.CryptogenicStrokeExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CryptogenicStrokeExt: AKI -> dose adjustment', () => {
  const r = Engine.CryptogenicStrokeExt({ CryptogenicStrokeExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CarotidStenosisExt: severe -> urgent specialist', () => {
  const r = Engine.CarotidStenosisExt({ CarotidStenosisExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CarotidStenosisExt: minimal -> lifestyle', () => {
  const r = Engine.CarotidStenosisExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CarotidStenosisExt: AKI -> dose adjustment', () => {
  const r = Engine.CarotidStenosisExt({ CarotidStenosisExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('VertebrobasilarExt: severe -> urgent specialist', () => {
  const r = Engine.VertebrobasilarExt({ VertebrobasilarExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('VertebrobasilarExt: minimal -> lifestyle', () => {
  const r = Engine.VertebrobasilarExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('VertebrobasilarExt: AKI -> dose adjustment', () => {
  const r = Engine.VertebrobasilarExt({ VertebrobasilarExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('LacunarStrokeExt: severe -> urgent specialist', () => {
  const r = Engine.LacunarStrokeExt({ LacunarStrokeExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('LacunarStrokeExt: minimal -> lifestyle', () => {
  const r = Engine.LacunarStrokeExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('LacunarStrokeExt: AKI -> dose adjustment', () => {
  const r = Engine.LacunarStrokeExt({ LacunarStrokeExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('StrokeInYoungExt: severe -> urgent specialist', () => {
  const r = Engine.StrokeInYoungExt({ StrokeInYoungExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('StrokeInYoungExt: minimal -> lifestyle', () => {
  const r = Engine.StrokeInYoungExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('StrokeInYoungExt: AKI -> dose adjustment', () => {
  const r = Engine.StrokeInYoungExt({ StrokeInYoungExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
