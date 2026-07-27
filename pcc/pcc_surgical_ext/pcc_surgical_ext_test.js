// P3-CH pcc_surgical_ext unit tests
const Engine = require('./pcc_surgical_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_surgical_ext engine tests:');
it('Urg', () => assertEq(Engine.Urgency({ u: 'emergent' }).plan, 'emergent-OR'));
it('App', () => assertEq(Engine.Approach({ a: 'robotic' }).plan, 'robotic-assisted'));
it('Pos', () => assertEq(Engine.Positioning({ p: 'prone' }).plan, 'prone-positioning'));
it('Tim', () => assertEq(Engine.Timeout({ t: 'fire' }).plan, 'fire-risk-timeout'));
it('Cnt', () => assertEq(Engine.Counts({ s: 'incorrect' }).plan, 'missing-item-XR'));
it('Ant', () => assertEq(Engine.Antibiotic({ t: 'redose' }).plan, 're-dose-2hr'));
it('Dvt', () => assertEq(Engine.Dvt({ r: 'high' }).plan, 'LMWH-and-SCDs'));
it('Imp', () => assertEq(Engine.Implant({ t: 'mesh' }).plan, 'mesh-implant'));
it('Ans', () => assertEq(Engine.Anesthesia({ t: 'spinal' }).plan, 'spinal-anesthesia'));
it('Spe', () => assertEq(Engine.Specimen({ t: 'path' }).plan, 'pathology-specimen'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
