// P3-EJ pcc_spine_surgery_ext unit tests
const Engine = require('./pcc_spine_surgery_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_spine_surgery_ext engine tests:');
it('SpinalStenosisEval', () => assertEq(Engine.SpinalStenosisEval({ t: 'yes' }).plan, 'spinalStenosisEval-protocol'));
it('DiscHerniationProtocol', () => assertEq(Engine.DiscHerniationProtocol({ t: 'yes' }).plan, 'discHerniationProtocol-protocol'));
it('SpinalFusionIndication', () => assertEq(Engine.SpinalFusionIndication({ t: 'yes' }).plan, 'spinalFusionIndication-protocol'));
it('ScoliosisSurgicalPlan', () => assertEq(Engine.ScoliosisSurgicalPlan({ t: 'yes' }).plan, 'scoliosisSurgicalPlan-protocol'));
it('SpinalCordTriage', () => assertEq(Engine.SpinalCordTriage({ t: 'yes' }).plan, 'spinalCordTriage-protocol'));
it('VertebralFracture', () => assertEq(Engine.VertebralFracture({ t: 'yes' }).plan, 'vertebralFracture-protocol'));
it('CaudaEquinaSyndrome', () => assertEq(Engine.CaudaEquinaSyndrome({ t: 'yes' }).plan, 'caudaEquinaSyndrome-protocol'));
it('SpinalTumorWorkup', () => assertEq(Engine.SpinalTumorWorkup({ t: 'yes' }).plan, 'spinalTumorWorkup-protocol'));
it('CervicalMyelopathy', () => assertEq(Engine.CervicalMyelopathy({ t: 'yes' }).plan, 'cervicalMyelopathy-protocol'));
it('SpondylolisthesisEval', () => assertEq(Engine.SpondylolisthesisEval({ t: 'yes' }).plan, 'spondylolisthesisEval-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
