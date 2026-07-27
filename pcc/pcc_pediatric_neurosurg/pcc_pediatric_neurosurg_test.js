// P3-EI pcc_pediatric_neurosurg unit tests
const Engine = require('./pcc_pediatric_neurosurg_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_neurosurg engine tests:');
it('PediatricHydrocephalus', () => assertEq(Engine.PediatricHydrocephalus({ t: 'yes' }).plan, 'pediatricHydrocephalus-protocol'));
it('ChiariMalformation', () => assertEq(Engine.ChiariMalformation({ t: 'yes' }).plan, 'chiariMalformation-protocol'));
it('Craniosynostosis', () => assertEq(Engine.Craniosynostosis({ t: 'yes' }).plan, 'craniosynostosis-protocol'));
it('SpinalDysraphism', () => assertEq(Engine.SpinalDysraphism({ t: 'yes' }).plan, 'spinalDysraphism-protocol'));
it('PediatricBrainTumorSurg', () => assertEq(Engine.PediatricBrainTumorSurg({ t: 'yes' }).plan, 'pediatricBrainTumorSurg-protocol'));
it('PediatricEpilepsySurg', () => assertEq(Engine.PediatricEpilepsySurg({ t: 'yes' }).plan, 'pediatricEpilepsySurg-protocol'));
it('PediatricTBI', () => assertEq(Engine.PediatricTBI({ t: 'yes' }).plan, 'pediatricTBI-protocol'));
it('PediatricSpineTrauma', () => assertEq(Engine.PediatricSpineTrauma({ t: 'yes' }).plan, 'pediatricSpineTrauma-protocol'));
it('PediatricVascularNeurosurg', () => assertEq(Engine.PediatricVascularNeurosurg({ t: 'yes' }).plan, 'pediatricVascularNeurosurg-protocol'));
it('PediatricCraniofacial', () => assertEq(Engine.PediatricCraniofacial({ t: 'yes' }).plan, 'pediatricCraniofacial-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
