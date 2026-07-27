// P3-CS pcc_sepsis unit tests
const Engine = require('./pcc_sepsis_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_sepsis engine tests:');
it('Sc', () => assertEq(Engine.Screening({ q: 3 }).plan, 'high-qsofa-screen'));
it('La', () => assertEq(Engine.Lactate({ v: 4 }).plan, 'elevated-lactate'));
it('Abx', () => assertEq(Engine.Abx({ m: '1hr' }).plan, 'antibiotic-1hr'));
it('Fl', () => assertEq(Engine.Fluid({ ml: 30 }).plan, '30ml-kg-fluid'));
it('Vp', () => assertEq(Engine.Vasopressor({ map: 65 }).plan, 'map-target-65'));
it('Cu', () => assertEq(Engine.Culture({ t: 'blood' }).plan, 'blood-culture'));
it('Sr', () => assertEq(Engine.SourceCtl({ t: 'abscess' }).plan, 'abscess-drainage'));
it('De', () => assertEq(Engine.DeEscalate({ c: 'narrow' }).plan, 'narrow-spectrum'));
it('Pr', () => assertEq(Engine.Procalcitonin({ v: 2 }).plan, 'elevated-procal'));
it('Sh', () => assertEq(Engine.SepsisShock({ t: 'confirmed' }).plan, 'septic-shock-bundle'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
