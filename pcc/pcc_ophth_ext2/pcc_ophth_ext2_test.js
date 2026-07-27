// P3-CO pcc_ophth_ext2 unit tests
const Engine = require('./pcc_ophth_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_ophth_ext2 engine tests:');
it('Vis', () => assertEq(Engine.Visual({ t: 'loss' }).plan, 'vision-loss-workup'));
it('Cat', () => assertEq(Engine.Cataract({ t: 'mature' }).plan, 'mature-cataract-surgery'));
it('Gla', () => assertEq(Engine.Glaucoma({ t: 'acute' }).plan, 'acute-angle-closure'));
it('Ret', () => assertEq(Engine.Retina({ t: 'detachment' }).plan, 'retinal-detachment-OR'));
it('Uve', () => assertEq(Engine.Uveitis({ t: 'acute' }).plan, 'acute-uveitis'));
it('Con', () => assertEq(Engine.Conjunctivitis({ t: 'viral' }).plan, 'viral-conjunctivitis'));
it('Ker', () => assertEq(Engine.Keratitis({ t: 'severe' }).plan, 'severe-keratitis'));
it('Mac', () => assertEq(Engine.Macular({ t: 'wet-AMD' }).plan, 'wet-AMD-anti-VEGF'));
it('Str', () => assertEq(Engine.Strab({ t: 'surgical' }).plan, 'strabismus-surgery'));
it('Tra', () => assertEq(Engine.Trauma({ t: 'globe-rupture' }).plan, 'globe-rupture-emergent'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
