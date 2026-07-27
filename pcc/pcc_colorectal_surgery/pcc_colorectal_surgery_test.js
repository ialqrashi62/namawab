// P3-DY pcc_colorectal_surgery unit tests
const Engine = require('./pcc_colorectal_surgery_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_colorectal_surgery engine tests:');
it('ColonCancerResection', () => assertEq(Engine.ColonCancerResection({ t: 'yes' }).plan, 'colonCancerResection-protocol'));
it('RectalCancerTME', () => assertEq(Engine.RectalCancerTME({ t: 'yes' }).plan, 'rectalCancerTME-protocol'));
it('LowAnteriorResection', () => assertEq(Engine.LowAnteriorResection({ t: 'yes' }).plan, 'lowAnteriorResection-protocol'));
it('HartmannProcedure', () => assertEq(Engine.HartmannProcedure({ t: 'yes' }).plan, 'hartmannProcedure-protocol'));
it('DiverticulitisSurgery', () => assertEq(Engine.DiverticulitisSurgery({ t: 'yes' }).plan, 'diverticulitisSurgery-protocol'));
it('IBDColectomy', () => assertEq(Engine.IBDColectomy({ t: 'yes' }).plan, 'iBDColectomy-protocol'));
it('ColostomyReversal', () => assertEq(Engine.ColostomyReversal({ t: 'yes' }).plan, 'colostomyReversal-protocol'));
it('AnalFissureSurgery', () => assertEq(Engine.AnalFissureSurgery({ t: 'yes' }).plan, 'analFissureSurgery-protocol'));
it('HemorrhoidectomyIndication', () => assertEq(Engine.HemorrhoidectomyIndication({ t: 'yes' }).plan, 'hemorrhoidectomyIndication-protocol'));
it('RectalProlapseRepair', () => assertEq(Engine.RectalProlapseRepair({ t: 'yes' }).plan, 'rectalProlapseRepair-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
