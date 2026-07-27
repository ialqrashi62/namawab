// P3-DW pcc_pediatric_surgery unit tests
const Engine = require('./pcc_pediatric_surgery_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_surgery engine tests:');
it('PediatricAppendectomyIndication', () => assertEq(Engine.PediatricAppendectomyIndication({ t: 'yes' }).plan, 'pediatricAppendectomyIndication-protocol'));
it('PyloricStenosisPyloromyotomy', () => assertEq(Engine.PyloricStenosisPyloromyotomy({ t: 'yes' }).plan, 'pyloricStenosisPyloromyotomy-protocol'));
it('PediatricHerniaRepair', () => assertEq(Engine.PediatricHerniaRepair({ t: 'yes' }).plan, 'pediatricHerniaRepair-protocol'));
it('IntussusceptionReduction', () => assertEq(Engine.IntussusceptionReduction({ t: 'yes' }).plan, 'intussusceptionReduction-protocol'));
it('PediatricCircumcision', () => assertEq(Engine.PediatricCircumcision({ t: 'yes' }).plan, 'pediatricCircumcision-protocol'));
it('PediatricTonsillectomy', () => assertEq(Engine.PediatricTonsillectomy({ t: 'yes' }).plan, 'pediatricTonsillectomy-protocol'));
it('PediatricCholecystectomy', () => assertEq(Engine.PediatricCholecystectomy({ t: 'yes' }).plan, 'pediatricCholecystectomy-protocol'));
it('PediatricBowelObstruction', () => assertEq(Engine.PediatricBowelObstruction({ t: 'yes' }).plan, 'pediatricBowelObstruction-protocol'));
it('PediatricTracheostomy', () => assertEq(Engine.PediatricTracheostomy({ t: 'yes' }).plan, 'pediatricTracheostomy-protocol'));
it('PediatricChestWallDeformity', () => assertEq(Engine.PediatricChestWallDeformity({ t: 'yes' }).plan, 'pediatricChestWallDeformity-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
