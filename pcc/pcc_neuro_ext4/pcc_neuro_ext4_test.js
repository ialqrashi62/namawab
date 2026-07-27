// P3-EM pcc_neuro_ext4 unit tests
const Engine = require('./pcc_neuro_ext4_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext4 engine tests:');
it('MitochondrialDiseaseNeuro', () => assertEq(Engine.MitochondrialDiseaseNeuro({ t: 'yes' }).plan, 'mitochondrialDiseaseNeuro-protocol'));
it('LeukodystrophyEval', () => assertEq(Engine.LeukodystrophyEval({ t: 'yes' }).plan, 'leukodystrophyEval-protocol'));
it('NeurocutaneousSyndromes', () => assertEq(Engine.NeurocutaneousSyndromes({ t: 'yes' }).plan, 'neurocutaneousSyndromes-protocol'));
it('CharcotMarieTooth', () => assertEq(Engine.CharcotMarieTooth({ t: 'yes' }).plan, 'charcotMarieTooth-protocol'));
it('MyastheniaGravisCrisis', () => assertEq(Engine.MyastheniaGravisCrisis({ t: 'yes' }).plan, 'myastheniaGravisCrisis-protocol'));
it('GuillainBarreSyndrome', () => assertEq(Engine.GuillainBarreSyndrome({ t: 'yes' }).plan, 'guillainBarreSyndrome-protocol'));
it('CIDPEval', () => assertEq(Engine.CIDPEval({ t: 'yes' }).plan, 'cIDPEval-protocol'));
it('ALSProtocol', () => assertEq(Engine.ALSProtocol({ t: 'yes' }).plan, 'aLSProtocol-protocol'));
it('PolymyositisDermatomyositis', () => assertEq(Engine.PolymyositisDermatomyositis({ t: 'yes' }).plan, 'polymyositisDermatomyositis-protocol'));
it('MyotonicDystrophy', () => assertEq(Engine.MyotonicDystrophy({ t: 'yes' }).plan, 'myotonicDystrophy-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
