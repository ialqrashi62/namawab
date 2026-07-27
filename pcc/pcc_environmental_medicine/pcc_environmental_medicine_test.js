// P3-DC pcc_environmental_medicine unit tests
const Engine = require('./pcc_environmental_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_environmental_medicine engine tests:');
it('AirQuality', () => assertEq(Engine.AirQuality({ t: 'yes' }).plan, 'airquality-protocol'));
it('WaterSafety', () => assertEq(Engine.WaterSafety({ t: 'yes' }).plan, 'watersafety-protocol'));
it('ToxinExposure', () => assertEq(Engine.ToxinExposure({ t: 'yes' }).plan, 'toxinexposure-protocol'));
it('AllergenMapping', () => assertEq(Engine.AllergenMapping({ t: 'yes' }).plan, 'allergenmapping-protocol'));
it('ClimateHealth', () => assertEq(Engine.ClimateHealth({ t: 'yes' }).plan, 'climatehealth-protocol'));
it('BuiltEnvironment', () => assertEq(Engine.BuiltEnvironment({ t: 'yes' }).plan, 'builtenvironment-protocol'));
it('OccupationalEnv', () => assertEq(Engine.OccupationalEnv({ t: 'yes' }).plan, 'occupationalenv-protocol'));
it('FoodEnvironment', () => assertEq(Engine.FoodEnvironment({ t: 'yes' }).plan, 'foodenvironment-protocol'));
it('VectorRisk', () => assertEq(Engine.VectorRisk({ t: 'yes' }).plan, 'vectorrisk-protocol'));
it('RadiationSafety', () => assertEq(Engine.RadiationSafety({ t: 'yes' }).plan, 'radiationsafety-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
