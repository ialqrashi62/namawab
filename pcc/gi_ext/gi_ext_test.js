'use strict';
const Engine = require('./gi_ext_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('GI EXT ENGINE TESTS\n========================================');

describe('CrohnsCDAI', () => {
  it('severe active', () => {
    const r = Engine.CrohnsDiseaseCDAI({ liquidStools: 35, abdominalPain: 4, generalWellbeing: 4, extraintestinalManifestations: 5, antiDiarrheal: 1, abdominalMass: 3, hematocrit: 25, weightLoss: 70 });
    assertEq(r.category, 'severe-active');
  });
});

describe('UC Mayo', () => {
  it('severe active', () => {
    const r = Engine.UlcerativeColitisMayo({ stoolFrequency: 3, rectalBleeding: 3, endoscopyFindings: 3, physicianGlobalAssessment: 3 });
    assertEq(r.category, 'severe-active');
  });
});

describe('Pancreatitis Severity', () => {
  it('severe ICU', () => {
    const r = Engine.AcutePancreatitisSeverity({ bisapScore: 4, organFailure: true });
    assertEq(r.severity, 'severe-ICU');
  });
});

describe('GERD LA', () => {
  it('LA grade D', () => {
    const r = Engine.GERDLAGrade({ laGrade: 'D' });
    assertEq(r.classification, 'LA-grade-D-very-severe-erosive');
  });
});

describe('Cirrhosis', () => {
  it('decompensated advanced', () => {
    const r = Engine.CirrhosisComplications({ childPugh: 'C', meld: 32 });
    assertEq(r.status, 'decompensated-advanced');
  });
});

describe('Celiac', () => {
  it('confirmed', () => {
    const r = Engine.CeliacDisease({ ttgIga: 30, duodenalBiopsyMarsh: 3 });
    assertEq(r.diagnosis, 'celiac-disease-confirmed');
  });
});

describe('IBS Rome IV', () => {
  it('IBS-D', () => {
    const r = Engine.IBSRomeIV({ abdominalPain: 3, durationMonths: 12, defecationRelation: true, stoolFormChange: 'loose-or-watery' });
    assertEq(r.subtype, 'IBS-D');
  });
});

describe('Ranson', () => {
  it('high mortality', () => {
    const r = Engine.AcutePancreatitisRanson({ age: 70, wbc: 18000, glucose: 250, ldh: 400, ast: 300, hctDrop: 12, bunRise: 8, calcium: 7, baseDeficit: 5, fluidSequestration: 8 });
    assertEq(r.mortality, 'high-50pct-mortality');
  });
});

describe('BCLC', () => {
  it('BCLC C', () => {
    const r = Engine.HCCStagingBCLC({ ecogPS: 1, childPugh: 'A', macrovascularInvasion: true });
    assertEq(r.stage, 'BCLC-C-advanced');
  });
});

describe('BowelPrep', () => {
  it('adequate excellent', () => {
    const r = Engine.EndoscopyBowelPreparation({ bostonBowelPrepScore: 8, splitDosePrep: true });
    assertEq(r.quality, 'adequate-excellent');
  });
});

console.log();
console.log('gi_ext engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
