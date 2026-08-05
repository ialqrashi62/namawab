// pcc_neuro_ext126_engine tests v3.316.47 (Phase 2 Batch 14 clinical-grade)
const Engine = require('./pcc_neuro_ext126_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext126 engine tests v3.316.47:');
it('MoyaMoyaAdultExt2: severe -> urgent specialist', () => {
  const r = Engine.MoyaMoyaAdultExt2({ MoyaMoyaAdultExt2: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MoyaMoyaAdultExt2: minimal -> lifestyle', () => {
  const r = Engine.MoyaMoyaAdultExt2({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MoyaMoyaAdultExt2: AKI -> dose adjustment', () => {
  const r = Engine.MoyaMoyaAdultExt2({ MoyaMoyaAdultExt2: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MoyaMoyaChildExt2: severe -> urgent specialist', () => {
  const r = Engine.MoyaMoyaChildExt2({ MoyaMoyaChildExt2: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MoyaMoyaChildExt2: minimal -> lifestyle', () => {
  const r = Engine.MoyaMoyaChildExt2({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MoyaMoyaChildExt2: AKI -> dose adjustment', () => {
  const r = Engine.MoyaMoyaChildExt2({ MoyaMoyaChildExt2: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CerebralRevascDirectExt: severe -> urgent specialist', () => {
  const r = Engine.CerebralRevascDirectExt({ CerebralRevascDirectExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CerebralRevascDirectExt: minimal -> lifestyle', () => {
  const r = Engine.CerebralRevascDirectExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CerebralRevascDirectExt: AKI -> dose adjustment', () => {
  const r = Engine.CerebralRevascDirectExt({ CerebralRevascDirectExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CerebralRevascIndirectExt: severe -> urgent specialist', () => {
  const r = Engine.CerebralRevascIndirectExt({ CerebralRevascIndirectExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CerebralRevascIndirectExt: minimal -> lifestyle', () => {
  const r = Engine.CerebralRevascIndirectExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CerebralRevascIndirectExt: AKI -> dose adjustment', () => {
  const r = Engine.CerebralRevascIndirectExt({ CerebralRevascIndirectExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CombinedRevascExt: severe -> urgent specialist', () => {
  const r = Engine.CombinedRevascExt({ CombinedRevascExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CombinedRevascExt: minimal -> lifestyle', () => {
  const r = Engine.CombinedRevascExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CombinedRevascExt: AKI -> dose adjustment', () => {
  const r = Engine.CombinedRevascExt({ CombinedRevascExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ICAToICABypassExt: severe -> urgent specialist', () => {
  const r = Engine.ICAToICABypassExt({ ICAToICABypassExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ICAToICABypassExt: minimal -> lifestyle', () => {
  const r = Engine.ICAToICABypassExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ICAToICABypassExt: AKI -> dose adjustment', () => {
  const r = Engine.ICAToICABypassExt({ ICAToICABypassExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HighFlowBypassExt: severe -> urgent specialist', () => {
  const r = Engine.HighFlowBypassExt({ HighFlowBypassExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HighFlowBypassExt: minimal -> lifestyle', () => {
  const r = Engine.HighFlowBypassExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HighFlowBypassExt: AKI -> dose adjustment', () => {
  const r = Engine.HighFlowBypassExt({ HighFlowBypassExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('STA_MCABypassExt: severe -> urgent specialist', () => {
  const r = Engine.STA_MCABypassExt({ STA_MCABypassExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('STA_MCABypassExt: minimal -> lifestyle', () => {
  const r = Engine.STA_MCABypassExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('STA_MCABypassExt: AKI -> dose adjustment', () => {
  const r = Engine.STA_MCABypassExt({ STA_MCABypassExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('OccipitalArteryBypassExt: severe -> urgent specialist', () => {
  const r = Engine.OccipitalArteryBypassExt({ OccipitalArteryBypassExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('OccipitalArteryBypassExt: minimal -> lifestyle', () => {
  const r = Engine.OccipitalArteryBypassExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('OccipitalArteryBypassExt: AKI -> dose adjustment', () => {
  const r = Engine.OccipitalArteryBypassExt({ OccipitalArteryBypassExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MultipleBypassExt: severe -> urgent specialist', () => {
  const r = Engine.MultipleBypassExt({ MultipleBypassExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MultipleBypassExt: minimal -> lifestyle', () => {
  const r = Engine.MultipleBypassExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MultipleBypassExt: AKI -> dose adjustment', () => {
  const r = Engine.MultipleBypassExt({ MultipleBypassExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
