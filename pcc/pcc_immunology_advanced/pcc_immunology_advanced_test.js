// P3-DP pcc_immunology_advanced unit tests
const Engine = require('./pcc_immunology_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_immunology_advanced engine tests:');
it('PrimaryImmunodeficiency', () => assertEq(Engine.PrimaryImmunodeficiency({ t: 'yes' }).plan, 'primaryimmunodeficiency-protocol'));
it('SecondaryImmunodeficiency', () => assertEq(Engine.SecondaryImmunodeficiency({ t: 'yes' }).plan, 'secondaryimmunodeficiency-protocol'));
it('AutoimmuneLymphoproliferative', () => assertEq(Engine.AutoimmuneLymphoproliferative({ t: 'yes' }).plan, 'autoimmunelymphoproliferative-protocol'));
it('ImmuneReconstitution', () => assertEq(Engine.ImmuneReconstitution({ t: 'yes' }).plan, 'immunereconstitution-protocol'));
it('CytokineStorm', () => assertEq(Engine.CytokineStorm({ t: 'yes' }).plan, 'cytokinestorm-protocol'));
it('HypersensitivityPneumonitis', () => assertEq(Engine.HypersensitivityPneumonitis({ t: 'yes' }).plan, 'hypersensitivitypneumonitis-protocol'));
it('ImmuneCheckpointToxicity', () => assertEq(Engine.ImmuneCheckpointToxicity({ t: 'yes' }).plan, 'immunecheckpointtoxicity-protocol'));
it('TransplantRejectionImmune', () => assertEq(Engine.TransplantRejectionImmune({ t: 'yes' }).plan, 'transplantrejectionimmune-protocol'));
it('VaccineResponseAssessment', () => assertEq(Engine.VaccineResponseAssessment({ t: 'yes' }).plan, 'vaccineresponseassessment-protocol'));
it('BiologicMonitoring', () => assertEq(Engine.BiologicMonitoring({ t: 'yes' }).plan, 'biologicmonitoring-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
