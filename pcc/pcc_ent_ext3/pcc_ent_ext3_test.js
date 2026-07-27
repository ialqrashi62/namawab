// P3-CO pcc_ent_ext3 unit tests
const Engine = require('./pcc_ent_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_ent_ext3 engine tests:');
it('Hear', () => assertEq(Engine.Hearing({ t: 'sensorineural' }).plan, 'SNHL-workup'));
it('OM', () => assertEq(Engine.Ottis({ t: 'acute' }).plan, 'acute-OM-antibiotics'));
it('Sin', () => assertEq(Engine.Sinusitis({ t: 'chronic' }).plan, 'chronic-sinusitis'));
it('Ton', () => assertEq(Engine.Tonsil({ t: 'recurrent' }).plan, 'recurrent-tonsillitis'));
it('Hrs', () => assertEq(Engine.Hoarseness({ t: 'chronic' }).plan, 'chronic-hoarseness-scope'));
it('Epi', () => assertEq(Engine.Epistaxis({ t: 'severe' }).plan, 'severe-epistaxis-cautery'));
it('Ver', () => assertEq(Engine.Vertigo({ t: 'BPPV' }).plan, 'BPPV-Epley'));
it('Tin', () => assertEq(Engine.Tinnitus({ t: 'chronic' }).plan, 'chronic-tinnitus'));
it('All', () => assertEq(Engine.Allergic({ t: 'severe' }).plan, 'severe-allergic-rhinitis'));
it('V2', () => assertEq(Engine.Vertigo2({ t: 'vestibular' }).plan, 'vestibular-neuronitis'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
