// P3-EH pcc_pediatric_gi_ext unit tests
const Engine = require('./pcc_pediatric_gi_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_gi_ext engine tests:');
it('PediatricGERDEvaluation', () => assertEq(Engine.PediatricGERDEvaluation({ t: 'yes' }).plan, 'pediatricGERDEvaluation-protocol'));
it('CeliacDisease', () => assertEq(Engine.CeliacDisease({ t: 'yes' }).plan, 'celiacDisease-protocol'));
it('PediatricIBD', () => assertEq(Engine.PediatricIBD({ t: 'yes' }).plan, 'pediatricIBD-protocol'));
it('HirschsprungDisease', () => assertEq(Engine.HirschsprungDisease({ t: 'yes' }).plan, 'hirschsprungDisease-protocol'));
it('PyloricStenosis', () => assertEq(Engine.PyloricStenosis({ t: 'yes' }).plan, 'pyloricStenosis-protocol'));
it('Intussusception', () => assertEq(Engine.Intussusception({ t: 'yes' }).plan, 'intussusception-protocol'));
it('PediatricHepatology', () => assertEq(Engine.PediatricHepatology({ t: 'yes' }).plan, 'pediatricHepatology-protocol'));
it('PediatricPancreatitis', () => assertEq(Engine.PediatricPancreatitis({ t: 'yes' }).plan, 'pediatricPancreatitis-protocol'));
it('NeonatalCholestasis', () => assertEq(Engine.NeonatalCholestasis({ t: 'yes' }).plan, 'neonatalCholestasis-protocol'));
it('PediatricLiverTransplant', () => assertEq(Engine.PediatricLiverTransplant({ t: 'yes' }).plan, 'pediatricLiverTransplant-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
