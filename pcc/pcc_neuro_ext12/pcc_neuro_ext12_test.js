// P3-EU pcc_neuro_ext12 unit tests
const Engine = require('./pcc_neuro_ext12_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext12 engine tests:');
it('NeuroAIDSEval', () => assertEq(Engine.NeuroAIDSEval({ t: 'yes' }).plan, 'neuroAIDSEval-protocol'));
it('PMLDiagnosis', () => assertEq(Engine.PMLDiagnosis({ t: 'yes' }).plan, 'pMLDiagnosis-protocol'));
it('JCVEval', () => assertEq(Engine.JCVEval({ t: 'yes' }).plan, 'jCVEval-protocol'));
it('ToxoplasmosisCerebral', () => assertEq(Engine.ToxoplasmosisCerebral({ t: 'yes' }).plan, 'toxoplasmosisCerebral-protocol'));
it('CryptococcalMeningitis', () => assertEq(Engine.CryptococcalMeningitis({ t: 'yes' }).plan, 'cryptococcalMeningitis-protocol'));
it('TBMeningitisEval', () => assertEq(Engine.TBMeningitisEval({ t: 'yes' }).plan, 'tB MeningitisEval-protocol'));
it('LymeNeuroborreliosis', () => assertEq(Engine.LymeNeuroborreliosis({ t: 'yes' }).plan, 'lymeNeuroborreliosis-protocol'));
it('BrucellosisNeuro', () => assertEq(Engine.BrucellosisNeuro({ t: 'yes' }).plan, 'brucellosisNeuro-protocol'));
it('WhippleDiseaseNeuro', () => assertEq(Engine.WhippleDiseaseNeuro({ t: 'yes' }).plan, 'whippleDiseaseNeuro-protocol'));
it('BehcetNeuroSyndrome', () => assertEq(Engine.BehcetNeuroSyndrome({ t: 'yes' }).plan, 'behcetNeuroSyndrome-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
