'use strict';
const Engine = require('./neuro_ext_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('NEURO EXT ENGINE TESTS\n========================================');

describe('MSEDSS', () => {
  it('wheelchair bed', () => {
    const r = Engine.MSEDSS({ pyramidal: 3, cerebellar: 2, brainstem: 1, sensory: 1, bowelBladder: 1, visual: 1, cerebral: 1 });
    assertEq(r.classification, 'restricted-to-wheelchair-or-bed');
  });
});

describe('MIDAS', () => {
  it('severe disability', () => {
    const r = Engine.MigraineDisabilityMIDAS({ missedWorkSchool: 10, missedHousehold: 5, missedFamily: 5, reducedWork: 5, reducedHousehold: 5 });
    assertEq(r.grade, 'IV-severe-disability');
  });
});

describe('ParkinsonUPDRS', () => {
  it('stage 3', () => {
    const r = Engine.ParkinsonUPDRS({ tremor: 2, rigidity: 2, bradykinesia: 3, posturalInstability: 2, gait: 2, speech: 1, facialExpression: 1 });
    assertEq(r.hoehnYahr, 'stage-3-bilateral-mild-disability');
  });
});

describe('AlzheimerStaging', () => {
  it('moderate', () => {
    const r = Engine.AlzheimerStaging({ cdrScore: 2, age: 75 });
    assertEq(r.stage, 'moderate-Alzheimer');
  });
});

describe('GuillainBarre', () => {
  it('severe respiratory', () => {
    const r = Engine.GuillainBarreSeverity({ respiratoryInvolvement: true, nadirWeakness: 'bed-bound' });
    assertEq(r.severity, 'severe-ICU-mechanical-ventilation-monitoring');
  });
});

describe('MyastheniaGravis', () => {
  it('crisis', () => {
    const r = Engine.MyastheniaGravisMGFA({ myasthenicCrisis: true });
    assert(r.treatment.includes('ICU'));
  });
});

describe('EpilepsySeizure', () => {
  it('drug resistant', () => {
    const r = Engine.EpilepsySeizureControl({ seizureFrequency: 8, drugResistant: true });
    assertEq(r.control, 'drug-resistant-epilepsy-presurgical-eval');
  });
});

describe('ICH Score', () => {
  it('very high mortality', () => {
    const r = Engine.IntracranialHemorrhageScore({ ichVolume: 50, ivh: true, age: 85, gcs: 6, infratentorial: true, anticoagulation: true });
    assertEq(r.category, 'very-high-30-day-mortality');
  });
});

describe('StatusEpilepticus', () => {
  it('third line', () => {
    const r = Engine.StatusEpilepticusManagement({ duration: 60, gcs: 5 });
    assert(r.phase === 'third-line-anesthetics-midazolam-propofol-pentobarbital');
  });
});

describe('MSEDSS mild', () => {
  it('normal or mild', () => {
    const r = Engine.MSEDSS({ pyramidal: 0, cerebellar: 0, brainstem: 0, sensory: 0, bowelBladder: 0, visual: 0, cerebral: 0 });
    assertEq(r.classification, 'normal-or-mild-disability');
  });
});

console.log();
console.log('neuro_ext engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
