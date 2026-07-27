// P3-CJ pcc_ob_ext2 unit tests
const Engine = require('./pcc_ob_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_ob_ext2 engine tests:');
it('GAD', () => assertEq(Engine.GADobstetric({ ga: 32 }).plan, 'preterm-GA-32'));
it('LN', () => assertEq(Engine.Labor({ st: 'active' }).plan, 'active-labor'));
it('Md', () => assertEq(Engine.Mode({ m: 'cesarean' }).plan, 'cesarean-section'));
it('FHR', () => assertEq(Engine.FHR({ bpm: 165 }).plan, 'fetal-tachycardia'));
it('Flt', () => assertEq(Engine.Filter({ y: 1 }).plan, 'year-1-medsafe'));
it('PNC', () => assertEq(Engine.PostnatalCare({ d: 2 }).plan, 'day-2-postpartum'));
it('Bld', () => assertEq(Engine.Bleeding({ ml: 1000 }).plan, 'PPH-protocol'));
it('Scr', () => assertEq(Engine.Screening({ t: 'GBS' }).plan, 'GBS-screen'));
it('Ant', () => assertEq(Engine.Antenatal({ tr: 3 }).plan, 'trimester-3-visit'));
it('Ris', () => assertEq(Engine.Risk({ score: 'high' }).plan, 'high-risk-maternal'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
