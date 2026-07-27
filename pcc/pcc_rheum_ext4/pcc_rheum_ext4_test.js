// P3-CM pcc_rheum_ext4 unit tests
const Engine = require('./pcc_rheum_ext4_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_rheum_ext4 engine tests:');
it('RA', () => assertEq(Engine.Ra({ t: 'active' }).plan, 'active-RA-DMARD'));
it('SLE', () => assertEq(Engine.Sle({ t: 'flare' }).plan, 'SLE-flare'));
it('SpA', () => assertEq(Engine.Spa({ t: 'axial' }).plan, 'axial-SpA'));
it('Vas', () => assertEq(Engine.Vasculitis({ t: 'GCA' }).plan, 'GCA-steroids'));
it('Gou', () => assertEq(Engine.Gout({ ua: 10 }).plan, 'severe-hyperuricemia'));
it('OAR', () => assertEq(Engine.Osteo({ t: 'severe' }).plan, 'severe-OA'));
it('Sjo', () => assertEq(Engine.Sjogren({ t: 'confirmed' }).plan, 'Sjogren-syndrome'));
it('Scl', () => assertEq(Engine.Scleroderma({ t: 'diffuse' }).plan, 'diffuse-scleroderma'));
it('Myo', () => assertEq(Engine.Myositis({ t: 'active' }).plan, 'active-myositis'));
it('Bio', () => assertEq(Engine.Biologic({ t: 'ritux' }).plan, 'rituximab'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
