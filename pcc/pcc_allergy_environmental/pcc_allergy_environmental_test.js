// P3-DJ pcc_allergy_environmental unit tests
const Engine = require('./pcc_allergy_environmental_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_allergy_environmental engine tests:');
it('PollenForecast', () => assertEq(Engine.PollenForecast({ t: 'yes' }).plan, 'pollenforecast-protocol'));
it('MoldExposure', () => assertEq(Engine.MoldExposure({ t: 'yes' }).plan, 'moldexposure-protocol'));
it('DustMite', () => assertEq(Engine.DustMite({ t: 'yes' }).plan, 'dustmite-protocol'));
it('PetDander', () => assertEq(Engine.PetDander({ t: 'yes' }).plan, 'petdander-protocol'));
it('Cockroach', () => assertEq(Engine.Cockroach({ t: 'yes' }).plan, 'cockroach-protocol'));
it('RodentAllergen', () => assertEq(Engine.RodentAllergen({ t: 'yes' }).plan, 'rodentallergen-protocol'));
it('IndoorAirQuality', () => assertEq(Engine.IndoorAirQuality({ t: 'yes' }).plan, 'indoorairquality-protocol'));
it('SeasonalStrategy', () => assertEq(Engine.SeasonalStrategy({ t: 'yes' }).plan, 'seasonalstrategy-protocol'));
it('EnvironmentalControl', () => assertEq(Engine.EnvironmentalControl({ t: 'yes' }).plan, 'environmentalcontrol-protocol'));
it('AllergenImmunotherapy', () => assertEq(Engine.AllergenImmunotherapy({ t: 'yes' }).plan, 'allergenimmunotherapy-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
