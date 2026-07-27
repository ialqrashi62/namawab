// P3-EI pcc_pediatric_oncology unit tests
const Engine = require('./pcc_pediatric_oncology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_oncology engine tests:');
it('PediatricLeukemiaALL', () => assertEq(Engine.PediatricLeukemiaALL({ t: 'yes' }).plan, 'pediatricLeukemiaALL-protocol'));
it('PediatricLeukemiaAML', () => assertEq(Engine.PediatricLeukemiaAML({ t: 'yes' }).plan, 'pediatricLeukemiaAML-protocol'));
it('PediatricBrainTumor', () => assertEq(Engine.PediatricBrainTumor({ t: 'yes' }).plan, 'pediatricBrainTumor-protocol'));
it('NeuroblastomaManagement', () => assertEq(Engine.NeuroblastomaManagement({ t: 'yes' }).plan, 'neuroblastomaManagement-protocol'));
it('WilmsTumorProtocol', () => assertEq(Engine.WilmsTumorProtocol({ t: 'yes' }).plan, 'wilmsTumorProtocol-protocol'));
it('PediatricLymphoma', () => assertEq(Engine.PediatricLymphoma({ t: 'yes' }).plan, 'pediatricLymphoma-protocol'));
it('PediatricBoneTumor', () => assertEq(Engine.PediatricBoneTumor({ t: 'yes' }).plan, 'pediatricBoneTumor-protocol'));
it('PediatricRetinoblastoma', () => assertEq(Engine.PediatricRetinoblastoma({ t: 'yes' }).plan, 'pediatricRetinoblastoma-protocol'));
it('PediatricHepaticTumor', () => assertEq(Engine.PediatricHepaticTumor({ t: 'yes' }).plan, 'pediatricHepaticTumor-protocol'));
it('PediatricOncologicEmergency', () => assertEq(Engine.PediatricOncologicEmergency({ t: 'yes' }).plan, 'pediatricOncologicEmergency-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
