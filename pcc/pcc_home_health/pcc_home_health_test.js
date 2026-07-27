// P3-CP pcc_home_health unit tests
const Engine = require('./pcc_home_health_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_home_health engine tests:');
it('In', () => assertEq(Engine.Intake({ t: 'skilled-nursing' }).plan, 'skilled-nursing-intake'));
it('Wn', () => assertEq(Engine.Wound({ t: 'stage-IV' }).plan, 'stage-IV-wound'));
it('Iv', () => assertEq(Engine.IvTherapy({ t: 'PICC' }).plan, 'PICC-line-care'));
it('Th', () => assertEq(Engine.Therapy({ t: 'PT' }).plan, 'PT-eval'));
it('MA', () => assertEq(Engine.MedAdmin({ t: 'complex' }).plan, 'complex-med-administration'));
it('Tl', () => assertEq(Engine.Tele({ t: 'monitoring' }).plan, 'tele-monitoring'));
it('Fl', () => assertEq(Engine.Falls({ t: 'high-risk' }).plan, 'high-fall-risk'));
it('Cg', () => assertEq(Engine.Caregiver({ t: 'burnout' }).plan, 'caregiver-burnout'));
it('Dsc', () => assertEq(Engine.Discharge({ t: 'stable' }).plan, 'home-health-discharge'));
it('Ad', () => assertEq(Engine.AdmitHome({ t: 'urgent' }).plan, 'urgent-home-admit'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
