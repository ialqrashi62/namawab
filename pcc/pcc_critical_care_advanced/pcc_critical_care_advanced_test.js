// P3-DL pcc_critical_care_advanced unit tests
const Engine = require('./pcc_critical_care_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_critical_care_advanced engine tests:');
it('ShockIndex', () => assertEq(Engine.ShockIndex({ t: 'yes' }).plan, 'shockindex-protocol'));
it('LactateClearance', () => assertEq(Engine.LactateClearance({ t: 'yes' }).plan, 'lactateclearance-protocol'));
it('Scvo2Monitoring', () => assertEq(Engine.Scvo2Monitoring({ t: 'yes' }).plan, 'scvo2monitoring-protocol'));
it('Microcirculation', () => assertEq(Engine.Microcirculation({ t: 'yes' }).plan, 'microcirculation-protocol'));
it('CuffPressure', () => assertEq(Engine.CuffPressure({ t: 'yes' }).plan, 'cuffpressure-protocol'));
it('PronePositioning', () => assertEq(Engine.PronePositioning({ t: 'yes' }).plan, 'pronepositioning-protocol'));
it('ECMOIndication', () => assertEq(Engine.ECMOIndication({ t: 'yes' }).plan, 'ecmoindication-protocol'));
it('CRRTDosing', () => assertEq(Engine.CRRTDosing({ t: 'yes' }).plan, 'crrtdosing-protocol'));
it('NeuromuscularBlock', () => assertEq(Engine.NeuromuscularBlock({ t: 'yes' }).plan, 'neuromuscularblock-protocol'));
it('DeliriumPrevention', () => assertEq(Engine.DeliriumPrevention({ t: 'yes' }).plan, 'deliriumprevention-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
