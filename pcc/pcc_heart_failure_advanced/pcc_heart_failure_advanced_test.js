// P3-DI pcc_heart_failure_advanced unit tests
const Engine = require('./pcc_heart_failure_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_heart_failure_advanced engine tests:');
it('NYHAStaging', () => assertEq(Engine.NYHAStaging({ t: 'yes' }).plan, 'nyhastaging-protocol'));
it('BNPTrend', () => assertEq(Engine.BNPTrend({ t: 'yes' }).plan, 'bnptrend-protocol'));
it('EjectionFraction', () => assertEq(Engine.EjectionFraction({ t: 'yes' }).plan, 'ejectionfraction-protocol'));
it('FluidStatus', () => assertEq(Engine.FluidStatus({ t: 'yes' }).plan, 'fluidstatus-protocol'));
it('CardiacDevice', () => assertEq(Engine.CardiacDevice({ t: 'yes' }).plan, 'cardiacdevice-protocol'));
it('HeartTransplantEval', () => assertEq(Engine.HeartTransplantEval({ t: 'yes' }).plan, 'hearttransplanteval-protocol'));
it('PalliativeHF', () => assertEq(Engine.PalliativeHF({ t: 'yes' }).plan, 'palliativehf-protocol'));
it('AcuteDecompensation', () => assertEq(Engine.AcuteDecompensation({ t: 'yes' }).plan, 'acutedecompensation-protocol'));
it('DiureticStrategy', () => assertEq(Engine.DiureticStrategy({ t: 'yes' }).plan, 'diureticstrategy-protocol'));
it('SelfManagement', () => assertEq(Engine.SelfManagement({ t: 'yes' }).plan, 'selfmanagement-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
