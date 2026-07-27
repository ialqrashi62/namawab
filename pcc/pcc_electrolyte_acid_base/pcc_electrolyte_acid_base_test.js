// P3-DN pcc_electrolyte_acid_base unit tests
const Engine = require('./pcc_electrolyte_acid_base_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_electrolyte_acid_base engine tests:');
it('HyponatremiaWorkup', () => assertEq(Engine.HyponatremiaWorkup({ t: 'yes' }).plan, 'hyponatremiaworkup-protocol'));
it('HypernatremiaWorkup', () => assertEq(Engine.HypernatremiaWorkup({ t: 'yes' }).plan, 'hypernatremiaworkup-protocol'));
it('HypokalemiaWorkup', () => assertEq(Engine.HypokalemiaWorkup({ t: 'yes' }).plan, 'hypokalemiaworkup-protocol'));
it('HyperkalemiaWorkup', () => assertEq(Engine.HyperkalemiaWorkup({ t: 'yes' }).plan, 'hyperkalemiaworkup-protocol'));
it('HypocalcemiaWorkup', () => assertEq(Engine.HypocalcemiaWorkup({ t: 'yes' }).plan, 'hypocalcemiaworkup-protocol'));
it('HypercalcemiaWorkup', () => assertEq(Engine.HypercalcemiaWorkup({ t: 'yes' }).plan, 'hypercalcemiaworkup-protocol'));
it('HypomagnesemiaWorkup', () => assertEq(Engine.HypomagnesemiaWorkup({ t: 'yes' }).plan, 'hypomagnesemiaworkup-protocol'));
it('HypophosphatemiaWorkup', () => assertEq(Engine.HypophosphatemiaWorkup({ t: 'yes' }).plan, 'hypophosphatemiaworkup-protocol'));
it('MetabolicAcidosis', () => assertEq(Engine.MetabolicAcidosis({ t: 'yes' }).plan, 'metabolicacidosis-protocol'));
it('MetabolicAlkalosis', () => assertEq(Engine.MetabolicAlkalosis({ t: 'yes' }).plan, 'metabolicalkalosis-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
