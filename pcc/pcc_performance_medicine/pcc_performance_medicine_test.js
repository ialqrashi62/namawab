// P3-DD pcc_performance_medicine unit tests
const Engine = require('./pcc_performance_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_performance_medicine engine tests:');
it('VO2Max', () => assertEq(Engine.VO2Max({ t: 'yes' }).plan, 'vo2max-protocol'));
it('LactateThreshold', () => assertEq(Engine.LactateThreshold({ t: 'yes' }).plan, 'lactatethreshold-protocol'));
it('MovementScreen', () => assertEq(Engine.MovementScreen({ t: 'yes' }).plan, 'movementscreen-protocol'));
it('CognitivePerformance', () => assertEq(Engine.CognitivePerformance({ t: 'yes' }).plan, 'cognitiveperformance-protocol'));
it('HRVMonitoring', () => assertEq(Engine.HRVMonitoring({ t: 'yes' }).plan, 'hrvmonitoring-protocol'));
it('SleepForPerformance', () => assertEq(Engine.SleepForPerformance({ t: 'yes' }).plan, 'sleepforperformance-protocol'));
it('MentalSkills', () => assertEq(Engine.MentalSkills({ t: 'yes' }).plan, 'mentalskills-protocol'));
it('EquipmentOptimization', () => assertEq(Engine.EquipmentOptimization({ t: 'yes' }).plan, 'equipmentoptimization-protocol'));
it('PeriodizationPlan', () => assertEq(Engine.PeriodizationPlan({ t: 'yes' }).plan, 'periodizationplan-protocol'));
it('Overtraining', () => assertEq(Engine.Overtraining({ t: 'yes' }).plan, 'overtraining-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
