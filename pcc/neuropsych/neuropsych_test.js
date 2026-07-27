'use strict';

const Engine = require('./neuropsych_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('neuropsych engine tests', () => {
  it('MoCA 18 MCI', () => {
    const r = Engine.MoCAScore({ totalScore: 18, educationYears: 12, age: 70 });
    assertEq(r.classification, 'mild-cognitive-impairment');
  });
  it('MMSE 23 mild', () => {
    const r = Engine.MMSEFolstein({ orientation: 8, registration: 2, attention: 4, recall: 1, language: 7, visuospatial: 1 });
    assertEq(r.classification, 'mild-cognitive-impairment');
  });
  it('ACE-III 70 AD', () => {
    const r = Engine.ACE3Addenbrokes({ attention: 16, memory: 18, fluency: 8, language: 22, visuospatial: 14 });
    assertEq(r.cutoff100, 'below-cutoff-88-suggestive-of-dementia');
  });
  it('BDS severe', () => {
    const r = Engine.BeckDepressionInventory({ score: 35 });
    assertEq(r.severity, 'severe-depression');
  });
  it('HAMA severe anxiety', () => {
    const r = Engine.HamiltonAnxietyScale({ score: 28 });
    assertEq(r.severity, 'severe-anxiety');
  });
  it('Trail A normal', () => {
    const r = Engine.TrailMakingTestA({ time: 35, errors: 1, age: 50 });
    assertEq(r.interpretation, 'normal-processing-speed');
  });
  it('TMT-B severe', () => {
    const r = Engine.TrailMakingTestB({ time: 200, errors: 0, age: 60 });
    assertEq(r.interpretation, 'severely-impaired-set-shifting');
  });
  it('delirium CAM positive', () => {
    const r = Engine.ConfusionAssessmentMethod({ acuteOnset: true, inattention: true, disorganizedThinking: true });
    assertEq(r.diagnosis, 'delirium-CAM-positive');
  });
  it('frontal dysfunction severe', () => {
    const r = Engine.FABFrontal({ conceptualization: 1, mentalFlexibility: 1, motorProgramming: 1, sensitivityInterference: 1, inhibitoryControl: 1, environmentalAutonomy: 1 });
    assertEq(r.interpretation, 'severe-frontal-dysfunction');
  });
  it('WAIS-FSIQ 70 disability', () => {
    const r = Engine.WAISFSIQEstimate({ verbalComprehension: 70, perceptualReasoning: 70, workingMemory: 70, processingSpeed: 70 });
    assertEq(r.classification, 'intellectual-disability');
  });
});

console.log(`\nneuropsych engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
