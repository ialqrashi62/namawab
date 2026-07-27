// P3-EP pcc_pediatric_surg_oncology unit tests
const Engine = require('./pcc_pediatric_surg_oncology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_surg_oncology engine tests:');
it('PediatricNeuroblastomaSurg', () => assertEq(Engine.PediatricNeuroblastomaSurg({ t: 'yes' }).plan, 'pediatricNeuroblastomaSurg-protocol'));
it('PediatricWilmsTumorSurg', () => assertEq(Engine.PediatricWilmsTumorSurg({ t: 'yes' }).plan, 'pediatricWilmsTumorSurg-protocol'));
it('PediatricHepatoblastomaSurg', () => assertEq(Engine.PediatricHepatoblastomaSurg({ t: 'yes' }).plan, 'pediatricHepatoblastomaSurg-protocol'));
it('PediatricRhabdomyosarcomaSurg', () => assertEq(Engine.PediatricRhabdomyosarcomaSurg({ t: 'yes' }).plan, 'pediatricRhabdomyosarcomaSurg-protocol'));
it('PediatricOsteosarcomaSurg', () => assertEq(Engine.PediatricOsteosarcomaSurg({ t: 'yes' }).plan, 'pediatricOsteosarcomaSurg-protocol'));
it('PediatricEwingsSurg', () => assertEq(Engine.PediatricEwingsSurg({ t: 'yes' }).plan, 'pediatricEwingsSurg-protocol'));
it('PediatricRetinoblastomaSurg', () => assertEq(Engine.PediatricRetinoblastomaSurg({ t: 'yes' }).plan, 'pediatricRetinoblastomaSurg-protocol'));
it('PediatricLymphomaSurg', () => assertEq(Engine.PediatricLymphomaSurg({ t: 'yes' }).plan, 'pediatricLymphomaSurg-protocol'));
it('PediatricBrainTumorSurgExt', () => assertEq(Engine.PediatricBrainTumorSurgExt({ t: 'yes' }).plan, 'pediatricBrainTumorSurgExt-protocol'));
it('PediatricGermCellTumorSurg', () => assertEq(Engine.PediatricGermCellTumorSurg({ t: 'yes' }).plan, 'pediatricGermCellTumorSurg-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
