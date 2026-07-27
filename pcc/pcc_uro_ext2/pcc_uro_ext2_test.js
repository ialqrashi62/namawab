// P3-CO pcc_uro_ext2 unit tests
const Engine = require('./pcc_uro_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_uro_ext2 engine tests:');
it('Bph', () => assertEq(Engine.Bph({ t: 'severe' }).plan, 'severe-BPH-TURP'));
it('Pca', () => assertEq(Engine.Pca({ t: 'metastatic' }).plan, 'metastatic-PCA'));
it('Ren', () => assertEq(Engine.Renal({ t: 'RCC' }).plan, 'RCC-workup'));
it('Stn', () => assertEq(Engine.Stone({ t: 'large' }).plan, 'large-stone-intervention'));
it('Bld', () => assertEq(Engine.Bladder({ t: 'cancer' }).plan, 'bladder-cancer-TURBT'));
it('Inc', () => assertEq(Engine.Incontinence({ t: 'urge' }).plan, 'urge-incontinence'));
it('Ere', () => assertEq(Engine.Erectile({ t: 'PDE5' }).plan, 'PDE5-responsive-ED'));
it('Urt', () => assertEq(Engine.Urethritis({ t: 'gonococcal' }).plan, 'gonococcal-urethritis'));
it('Pst', () => assertEq(Engine.Prostatitis({ t: 'acute' }).plan, 'acute-bacterial-prostatitis'));
it('Hem', () => assertEq(Engine.Hematuria({ t: 'gross' }).plan, 'gross-hematuria-workup'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
