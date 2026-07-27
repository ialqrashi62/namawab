// P3-CQ pcc_case_mgmt unit tests
const Engine = require('./pcc_case_mgmt_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_case_mgmt engine tests:');
it('In', () => assertEq(Engine.Intake({ t: 'urgent' }).plan, 'urgent-case'));
it('Cd', () => assertEq(Engine.Coord({ t: 'complex' }).plan, 'complex-coord'));
it('Dc', () => assertEq(Engine.Dc({ t: 'planned' }).plan, 'planned-discharge'));
it('Tr', () => assertEq(Engine.Transition({ t: 'care-level' }).plan, 'care-level-transition'));
it('Fu', () => assertEq(Engine.Followup({ t: 'scheduled' }).plan, 'scheduled-followup'));
it('Br', () => assertEq(Engine.Barriers({ t: 'multiple' }).plan, 'multiple-barriers'));
it('In2', () => assertEq(Engine.Insurance({ t: 'pending' }).plan, 'insurance-pending'));
it('UT', () => assertEq(Engine.Uta({ t: 'yes' }).plan, 'UTA-risk'));
it('Ra', () => assertEq(Engine.Readmission({ t: 'high' }).plan, 'high-readmission-risk'));
it('Md', () => assertEq(Engine.Multidisc({ t: 'rounds' }).plan, 'multidisc-rounds'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
