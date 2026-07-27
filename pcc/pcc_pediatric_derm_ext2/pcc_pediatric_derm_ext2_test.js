// P3-EU pcc_pediatric_derm_ext2 unit tests
const Engine = require('./pcc_pediatric_derm_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_derm_ext2 engine tests:');
it('PediatricGenodermatoses', () => assertEq(Engine.PediatricGenodermatoses({ t: 'yes' }).plan, 'pediatricGenodermatoses-protocol'));
it('PediatricIchthyosis', () => assertEq(Engine.PediatricIchthyosis({ t: 'yes' }).plan, 'pediatricIchthyosis-protocol'));
it('PediatricEB', () => assertEq(Engine.PediatricEB({ t: 'yes' }).plan, 'pediatricEB-protocol'));
it('PediatricCutisLaxa', () => assertEq(Engine.PediatricCutisLaxa({ t: 'yes' }).plan, 'pediatricCutisLaxa-protocol'));
it('PediatricEhlersDanlos', () => assertEq(Engine.PediatricEhlersDanlos({ t: 'yes' }).plan, 'pediatricEhlersDanlos-protocol'));
it('PediatricMarfan', () => assertEq(Engine.PediatricMarfan({ t: 'yes' }).plan, 'pediatricMarfan-protocol'));
it('PediatricNeurofibromatosisSkin', () => assertEq(Engine.PediatricNeurofibromatosisSkin({ t: 'yes' }).plan, 'pediatricNeurofibromatosisSkin-protocol'));
it('PediatricTSCSutscutaneous', () => assertEq(Engine.PediatricTSCSutscutaneous({ t: 'yes' }).plan, 'pediatricTSCSutscutaneous-protocol'));
it('PediatricXP', () => assertEq(Engine.PediatricXP({ t: 'yes' }).plan, 'pediatricXP-protocol'));
it('PediatricPorphyrias', () => assertEq(Engine.PediatricPorphyrias({ t: 'yes' }).plan, 'pediatricPorphyrias-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
