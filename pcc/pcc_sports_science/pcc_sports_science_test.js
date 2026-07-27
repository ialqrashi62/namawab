// P3-DD pcc_sports_science unit tests
const Engine = require('./pcc_sports_science_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_sports_science engine tests:');
it('Biomechanics', () => assertEq(Engine.Biomechanics({ t: 'yes' }).plan, 'biomechanics-protocol'));
it('LoadMonitoring', () => assertEq(Engine.LoadMonitoring({ t: 'yes' }).plan, 'loadmonitoring-protocol'));
it('InjuryRisk', () => assertEq(Engine.InjuryRisk({ t: 'yes' }).plan, 'injuryrisk-protocol'));
it('ReturnToPlay', () => assertEq(Engine.ReturnToPlay({ t: 'yes' }).plan, 'returntoplay-protocol'));
it('NutritionPeriodization', () => assertEq(Engine.NutritionPeriodization({ t: 'yes' }).plan, 'nutritionperiodization-protocol'));
it('HydrationStrategy', () => assertEq(Engine.HydrationStrategy({ t: 'yes' }).plan, 'hydrationstrategy-protocol'));
it('RecoveryOptimization', () => assertEq(Engine.RecoveryOptimization({ t: 'yes' }).plan, 'recoveryoptimization-protocol'));
it('YouthAthlete', () => assertEq(Engine.YouthAthlete({ t: 'yes' }).plan, 'youthathlete-protocol'));
it('TeamHealth', () => assertEq(Engine.TeamHealth({ t: 'yes' }).plan, 'teamhealth-protocol'));
it('AltitudeTraining', () => assertEq(Engine.AltitudeTraining({ t: 'yes' }).plan, 'altitudetraining-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
