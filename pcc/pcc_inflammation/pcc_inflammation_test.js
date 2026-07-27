// P3-DF pcc_inflammation unit tests
const Engine = require('./pcc_inflammation_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_inflammation engine tests:');
it('CRPTrend', () => assertEq(Engine.CRPTrend({ t: 'yes' }).plan, 'crptrend-protocol'));
it('ESRPattern', () => assertEq(Engine.ESRPattern({ t: 'yes' }).plan, 'esrpattern-protocol'));
it('CytokineStorm', () => assertEq(Engine.CytokineStorm({ t: 'yes' }).plan, 'cytokinestorm-protocol'));
it('ChronicInflammation', () => assertEq(Engine.ChronicInflammation({ t: 'yes' }).plan, 'chronicinflammation-protocol'));
it('Neuroinflammation', () => assertEq(Engine.Neuroinflammation({ t: 'yes' }).plan, 'neuroinflammation-protocol'));
it('CardiovascularInflammation', () => assertEq(Engine.CardiovascularInflammation({ t: 'yes' }).plan, 'cardiovascularinflammation-protocol'));
it('GutInflammation', () => assertEq(Engine.GutInflammation({ t: 'yes' }).plan, 'gutinflammation-protocol'));
it('AutoimmuneFlare', () => assertEq(Engine.AutoimmuneFlare({ t: 'yes' }).plan, 'autoimmuneflare-protocol'));
it('AntiInflammatoryDiet', () => assertEq(Engine.AntiInflammatoryDiet({ t: 'yes' }).plan, 'antiinflammatorydiet-protocol'));
it('InflammationResolution', () => assertEq(Engine.InflammationResolution({ t: 'yes' }).plan, 'inflammationresolution-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
