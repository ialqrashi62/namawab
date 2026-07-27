// P3-EL pcc_neuro_ext3 unit tests
const Engine = require('./pcc_neuro_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext3 engine tests:');
it('NeuroSarcoidosisEval', () => assertEq(Engine.NeuroSarcoidosisEval({ t: 'yes' }).plan, 'neuroSarcoidosisEval-protocol'));
it('NeuroBehcetEval', () => assertEq(Engine.NeuroBehcetEval({ t: 'yes' }).plan, 'neuroBehcetEval-protocol'));
it('NeurosyphilisProtocol', () => assertEq(Engine.NeurosyphilisProtocol({ t: 'yes' }).plan, 'neurosyphilisProtocol-protocol'));
it('NeuroLymeDisease', () => assertEq(Engine.NeuroLymeDisease({ t: 'yes' }).plan, 'neuroLymeDisease-protocol'));
it('NeuromyelitisOptica', () => assertEq(Engine.NeuromyelitisOptica({ t: 'yes' }).plan, 'neuromyelitisOptica-protocol'));
it('ProgressiveMS', () => assertEq(Engine.ProgressiveMS({ t: 'yes' }).plan, 'progressiveMS-protocol'));
it('MOGAntibodyDisease', () => assertEq(Engine.MOGAntibodyDisease({ t: 'yes' }).plan, 'mOGAntibodyDisease-protocol'));
it('CLIPPERSProtocol', () => assertEq(Engine.CLIPPERSProtocol({ t: 'yes' }).plan, 'cLIPPERSProtocol-protocol'));
it('AutoimmuneEncephalitisExtended', () => assertEq(Engine.AutoimmuneEncephalitisExtended({ t: 'yes' }).plan, 'autoimmuneEncephalitisExtended-protocol'));
it('CNSVasculitis', () => assertEq(Engine.CNSVasculitis({ t: 'yes' }).plan, 'cNSVasculitis-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
