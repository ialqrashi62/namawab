// P3-EV pcc_pediatric_neuro_ext2 unit tests
const Engine = require('./pcc_pediatric_neuro_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_neuro_ext2 engine tests:');
it('PediatricFebrileSeizure', () => assertEq(Engine.PediatricFebrileSeizure({ t: 'yes' }).plan, 'pediatricFebrileSeizure-protocol'));
it('PediatricStatusEpilepticusExt', () => assertEq(Engine.PediatricStatusEpilepticusExt({ t: 'yes' }).plan, 'pediatricStatusEpilepticusExt-protocol'));
it('PediatricEpilepsySyndrome', () => assertEq(Engine.PediatricEpilepsySyndrome({ t: 'yes' }).plan, 'pediatricEpilepsySyndrome-protocol'));
it('PediatricLennoxGastaut', () => assertEq(Engine.PediatricLennoxGastaut({ t: 'yes' }).plan, 'pediatricLennoxGastaut-protocol'));
it('PediatricWestSyndrome', () => assertEq(Engine.PediatricWestSyndrome({ t: 'yes' }).plan, 'pediatricWestSyndrome-protocol'));
it('PediatricDravet', () => assertEq(Engine.PediatricDravet({ t: 'yes' }).plan, 'pediatricDravet-protocol'));
it('PediatricDooseSyndrome', () => assertEq(Engine.PediatricDooseSyndrome({ t: 'yes' }).plan, 'pediatricDooseSyndrome-protocol'));
it('PediatricLandauKleffner', () => assertEq(Engine.PediatricLandauKleffner({ t: 'yes' }).plan, 'pediatricLandauKleffner-protocol'));
it('PediatricCSWSSyndrome', () => assertEq(Engine.PediatricCSWSSyndrome({ t: 'yes' }).plan, 'pediatricCSWSSyndrome-protocol'));
it('PediatricEpilepsySurgeryEval', () => assertEq(Engine.PediatricEpilepsySurgeryEval({ t: 'yes' }).plan, 'pediatricEpilepsySurgeryEval-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
